import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// Services
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service';
import { PostsStateService } from '../../../services/State Services/posts-state.service';
import { UpdatePostService } from '../../../services/client_services/update-post.service';

@Component({
  selector: 'app-client-edit-post',
  templateUrl: './client-edit-post.component.html',
  styleUrls: ['./client-edit-post.component.css']
})
export class ClientEditPostComponent implements OnInit {

  constructor(
    public CurrentUserStateService: CurrentUserStateService,
    public PostsStateService: PostsStateService,
    private UpdatePostService: UpdatePostService
  ) { }

  post: any;
  editPostForm = new FormGroup({
    caption: new FormControl(''),
    accessibility: new FormControl(''),
    tipAmount: new FormControl('')
  });
  ngOnInit() {
    
    console.log("Edit post modal started");
    $(document).on('show.bs.modal','#editPostModal', () => {
      console.log("Edit post modal open");
      this.post = this.PostsStateService.getPostToBeEdited();
      
      if(this.post.accessibility == 'tipped'){
        this.editPostForm.patchValue(
          {
            "caption": this.post.caption,
            "accessibility": "subscribed",
            "tipAmount": this.post.tip_to_unlock
          }
        )
      }
      else{
        this.editPostForm.patchValue(
          {
            "caption": this.post.caption,
            "accessibility": this.post.accessibility,
            "tipAmount": 0
          }
        )
      }
      
      console.log(this.post);
    })
    $(document).on('hide.bs.modal','#editPostModal',  ()=> {
      console.log("Edit post modal Closed");
      this.editPostForm.reset();
    })
    
  }

  get editPostFormControl(){
    return this.editPostForm.controls;
  }

  edit_post_spinner = false;
  editPostChanges(){
    this.edit_post_spinner = true;
    var tip_ampount = this.editPostForm.value.tipAmount;
    var post_accessibility = this.editPostForm.value.accessibility;
    if(post_accessibility == 'subscribed' && tip_ampount > 0){
      post_accessibility = 'tipped';
    }
    var edited_post = {
      "id": this.PostsStateService.getPostToBeEdited()._id,
      "caption": this.editPostForm.value.caption,
      "accessibility": post_accessibility,
      "tip_to_unlock": tip_ampount,
    }
    this.UpdatePostService.edit_post(edited_post).subscribe(
      (res: any)=>{
        console.log(res);
        this.PostsStateService.updateEditedPost(res);
        this.edit_post_spinner = false;
        $('#editPostModal').modal('hide');
      },
      (err: any)=>{
        console.log(err);
        this.edit_post_spinner = false;
      }
    )
  }

}
