import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FetchPostsService } from '../../../services/user_services/fetch-posts.service';
import { FileUploadService } from '../../../services/client_services/file-upload.service';
import { HttpResponse } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-upload',
  templateUrl: './client-upload.component.html',
  styleUrls: ['./client-upload.component.css']
})
export class ClientUploadComponent implements OnInit {

  constructor(
    private FetchPostsService: FetchPostsService, 
    private FileUploadService: FileUploadService,
    private Router: Router,
    
    ) { }

  posts:any;
  ngOnInit(): void {
    

  }
  fetch_posts(){
    this.FetchPostsService.get_posts().subscribe((res)=>{
      this.posts = res;
    })
  }

  create_post(form: NgForm){
    this.FetchPostsService.create_post({
      post_title: form.value.post_title,
      post_description: form.value.post_content 
    }).subscribe((res)=>{
      console.log(res.post_title);
    })
  }



  files: File[] = [];
  fileObj:File;
	onSelect(event: any) {
		this.files.push(...event.addedFiles);
	}

	onRemove(file: File) {
		this.files.splice(this.files.indexOf(file), 1);
	}


  upload_server_error_message: String;
  onUploadPost(post_form: any){
    var post:any = {
      caption: "",
      accessibility: "all",

    }
    post.caption = post_form.value.post_caption;
    var post_access = (document.getElementById('accessibility_subscribed') as HTMLInputElement).checked ? "subscribed":"all";
    post.accessibility = post_access;
    post.media_type = this.files[0].type.split('/')[0];

    this.fileObj = this.files[0];
    if (!this.fileObj) {
      // this.errorMsg = true
      return
    }
    
    this.FileUploadService.getpresignedurls(this.fileObj.name, this.fileObj.type).subscribe(async (res) => {
      if (res.success) {
        const fileuploadurl = res.urls[0];
        const imageForm = new FormData();
        imageForm.append('image', this.fileObj);
        await this.FileUploadService.uploadfileAWSS3(fileuploadurl, this.fileObj.type, this.fileObj).subscribe(async (res) => {
          var media_url = (res as any).url;
          var status = (res as any).status;
          if(status == 200){
            post.media = media_url;
            this.FileUploadService.uploadPost(post).subscribe(
              (res: any)=>{
                console.log(res);
                // Successfully Created Post
                var Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000
                });
                Toast.fire({
                  icon: 'success',
                  title: 'Post Successfully Created'
                })
                setTimeout(()=>{
                  // window.location.reload();
                  console.log(window.location.origin);
                  window.open(window.location.origin+'/client/upload',"_self");
                  // this.Router.navigateByUrl('../upload');
                  
                },1000)
              },
              (err: any)=>{
                var Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000
                });
                Toast.fire({
                  icon: 'error',
                  title: err
                })
                
                this.upload_server_error_message = err;
                console.log("Error : ",err);
                // this.Router.navigateByUrl('/');
                // window.location.reload();
              }
            )
          }
          
        });
      }
    });
  }

  changeAccessibility(event: Event){
    console.log(event.target);
  }

}
