import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  // @ViewChild('post_tip_to_unlock', { static: true }) input: ElementRef;
  ngOnInit(): void {
    console.log(this.files);
  }

  fetch_posts(){
    this.FetchPostsService.get_posts().subscribe((res)=>{
      this.posts = res;
    })
  }

  // create_post(form: NgForm){
  //   this.FetchPostsService.create_post({
  //     post_title: form.value.post_title,
  //     post_description: form.value.post_content 
  //   }).subscribe((res)=>{
  //     console.log(res.post_title);
  //   })
  // }



  files: File[] = [];
  fileObj:File;
  
	onSelect(event: any) {
		this.files.push(...event.addedFiles);
    console.log(this.files);
	}

	onRemove(file: File) {
		this.files.splice(this.files.indexOf(file), 1);
    console.log(this.files);
	}


  upload_server_error_message: String;
  post = {
    caption: "",
    accessibility: "all",
    media_type: "",
    media: "",
    tip_to_unlock: 0

  };
  media_upload_error_message: any;
  uploading_post_spinner = false;
  onUploadPost(post_form: any){
    this.uploading_post_spinner = true;
    // var post:any = {
    //   caption: "",
    //   accessibility: "all",
    // }
    this.post.caption = post_form.value.post_caption;
    var post_access = (document.getElementById('accessibility_subscribed') as HTMLInputElement).checked ? "subscribed":"all";
    this.post.accessibility = post_access;
    this.post.media_type = this.files[0].type.split('/')[0];

    // Checking the accessibility and setting the tip amount accordingly
    if(this.post.accessibility== "all"){
      this.post.tip_to_unlock = 0;
    }
    
    this.fileObj = this.files[0];
    if (!this.fileObj) {
      this.media_upload_error_message = "Select a Image/Video/Audio to upload a Post";
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
            this.post.media = media_url;
            this.FileUploadService.uploadPost(this.post).subscribe(
              (res: any)=>{
                if(res){
                  this.uploading_post_spinner = false;
                }
                // console.log(res);
                
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
