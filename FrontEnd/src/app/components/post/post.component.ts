import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from '../../services/user_services/auth.service';
import { UserPostService } from '../../services/user_services/user-post.service';
import Swal from 'sweetalert2';
import { UserPaymentService } from '../../services/user_services/user-payment.service';

// Services
import { PostsStateService } from '../../services/State Services/posts-state.service';
import { CurrentUserStateService } from '../../services/State Services/current-user-state.service';
import { CommentService } from '../../services/comment_services/comment.service';
import { CommentStateService } from '../../services/State Services/comment-state.service';
import { UpdatePostService } from '../../services/client_services/update-post.service'; 
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {

  @Input()
  post_details: any;

  @Output() 
  newTipPostEvent = new EventEmitter<any>(); 

  constructor(
    private AuthService: AuthService,
    private UserPostService: UserPostService,
    private UserPaymentService: UserPaymentService,
    private PostsStateService: PostsStateService,
    public CurrentUserStateService: CurrentUserStateService,
    private CommentService: CommentService,
    public CommentStateService: CommentStateService,
    private UpdatePostService: UpdatePostService
  ) { }

  dt:any;
  tm:any;
  is_logged_in:boolean;
  tipToUnlockPostAmount:number = 0;
  tip_post:any = null;
  post_to_be_deleted: any = null;
  ngOnInit(): void {
    // console.log(this.post_details);
    this.post_details.post_info.media = this.post_details.post_info.media?.split('?')[0];
    this.is_logged_in = this.AuthService.isLoggedIn();
    var datetime = moment(this.post_details.post_info.date_created);
    this.dt = datetime.format('YYYY-MM-DD');
    this.tm = datetime.format('LT');


    $('#tipToUnlockModal').on('hide.bs.modal', (e)=> {
      this.tipToUnlockPostAmount = 0;
    })
    $('#tipModal').on('hide.bs.modal', (e)=> {
      this.tip_post = null;
    })

    $('#deletePostModal').on('hide.bs.modal',(e)=>{
      this.post_to_be_deleted = null;
    })
    
  }

  // Like/Dislike Feature
  likeOrDislikePost(pd: any){
    // console.log(pd);

    // Dislike
    if(this.post_details.is_liked){
      this.post_details.post_info.no_of_likes -= 1;
      this.post_details.is_liked = false;
    }
    else{
      this.post_details.post_info.no_of_likes += 1;
      this.post_details.is_liked = true;
    }
    this.PostsStateService.updatePost(this.post_details);
    this.UserPostService.like_or_dislike_post(pd).subscribe(
      (res: any)=>{
        this.post_details.is_liked = res.is_liked
        // if(res.is_liked){
        //   this.post_details.post_info.no_of_likes += 1;
        // }
        // else{
        //   this.post_details.post_info.no_of_likes -= 1;
        // }

        // Update Post State
        this.PostsStateService.updatePost(this.post_details);
        console.log(this.post_details);
      },
      (err: any)=>{
        console.log(err);
        // Revert Changes
        // Dislike
        if(this.post_details.is_liked){
          this.post_details.post_info.no_of_likes -= 1;
          this.post_details.is_liked = false;
        }
        else{
          this.post_details.post_info.no_of_likes += 1;
          this.post_details.is_liked = true;
        }
        this.PostsStateService.updatePost(this.post_details);

      }
    );
  }



  // Tip Feature
  openTipToUnlockModal(pd: any){
    this.newTipPostEvent.emit(pd);
    $('#tipToUnlockModal').modal('show');

    // console.log(this.post_details);
    // this.UserPaymentService.set_pay_to_unlock_post(pd);

    // this.ModalsComponent.openTipToUnlockModal(this.post_details);
    // this.tipToUnlockPostAmount = this.post_details.post_info.tip_to_unlock;
    // setTimeout(function(){
    //     $('#tipModal').modal('show');    
    // }, 230);
  }

  payToUnlockPost(tipToUnlockForm:any){
    var post_to_unlock_details = {
      post_id: "",
      user_id: "",
      client_id: "",
      tip_amount: 0
    };

    if(tipToUnlockForm.value.tipToUnlockAmount >= this.post_details.post_info.tip_to_unlock){
      post_to_unlock_details.post_id = this.post_details.post_info._id;
      post_to_unlock_details.user_id = this.post_details.user_id;
      post_to_unlock_details.client_id = this.post_details.client_id;
      post_to_unlock_details.tip_amount = tipToUnlockForm.value.tipToUnlockAmount;

      this.UserPostService.pay_to_unlock(post_to_unlock_details).subscribe(
        (res:any)=>{
          // Successfully Payment Done and Unlocked the post
          var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            icon: 'success',
            title: 'Successfully Payment Done and Post Unlocked'
          })
          setTimeout(()=>{
            // window.location.reload();
            console.log(window.location.origin);
            window.open(window.location.origin+'',"_self");
            // this.Router.navigateByUrl('../upload');
            
          },1000)
          console.log(res);
        },
        (err:any)=>{
          console.log(err);
        }
      )
      console.log(post_to_unlock_details);
      console.log(this.post_details);
    }
    
  }
  
  openTipModal(pd: any){
    this.newTipPostEvent.emit(pd);
    // this.tip_post = this.post_details;
    // console.log(this.tip_post);
  }
  
  tipToPost(tipPostForm:any){
    var post_tip_details = {
      post_id: "",
      user_id: "",
      client_id: "",
      tip_amount: 0
    };
    // console.log(this.tip_post);
    return;
    post_tip_details.post_id = this.tip_post.post_info._id;
    post_tip_details.user_id = this.tip_post.user_id;
    post_tip_details.client_id = this.tip_post.client_id;
    post_tip_details.tip_amount = tipPostForm.value.tip_amount;
    console.log(post_tip_details);
    this.UserPostService.pay_tip_to_post(post_tip_details).subscribe(
      (res:any)=>{
        // Successfully Payment Done 
        var Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        var Toast_thankyou = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          icon: 'success',
          title: 'Successfully Payment Done'
        })
        Toast_thankyou.fire({
          icon: 'success',
          title: 'Thank You for The Tip'
        })
        setTimeout(()=>{
          // window.location.reload();
          // console.log(window.location.origin);
          // window.open(window.location.origin+'',"_self");
          // this.Router.navigateByUrl('../upload');

          $('#tipModal').modal('toggle')
          
        },1000)
        console.log(res);
      },
      (err:any)=>{
        console.log(err);
      }
    );
    console.log(tipPostForm.value.tip_amount);
  }

  open_comment_container = false;
  prev_comment_loading_spinner = false;
  // Comment Feature
  show_hide_comment(){
    this.prev_comment_loading_spinner = true;
    // console.log(this.CommentStateService.getCommentsForPost(this.post_details.post_info._id));
    this.open_comment_container = !this.open_comment_container;
    this.CommentService.getCommnetsForPost(this.post_details.post_info).subscribe(
      (res: any)=>{
        this.prev_comment_loading_spinner = false;
        if(res.length > 0){
          this.CommentStateService.updateCommentsForPost(res)
        } 
        
        // console.log(res);
      },
      (err: any)=>{
        this.prev_comment_loading_spinner = false;
        console.log(err);
      }
    )
  }
  comment(comment_text: any){
    console.log(comment_text.value);
    if(comment_text.value == ""){
      return
    }
    var comment_info = {
      "post_id": this.post_details.post_info._id,
      "comment_text": comment_text.value
    }
    comment_text.value="";
    this.CommentService.makeComment(comment_info).subscribe(
      (res: any)=>{
        this.CommentStateService.addSingleCommentForPost(res);
      },
      (err: any)=>{
        console.log(err);
      }
    )
  }
  likeDislikeComment(comment_id: any){
    
    this.CommentService.likeCommentForPost(comment_id).subscribe(
      (res: any)=>{
        if(res.success){
          var current_post_comment = this.CommentStateService.getSingleCommentForPost(comment_id,this.post_details.post_info._id);
          if(res.is_liked){
            // Like the comment
            current_post_comment.comment_likes_count += 1;
            current_post_comment.is_liked_by_user = true;
          }
          else{
            // Dislike the comment
            if(current_post_comment.comment_likes_count>0){
              current_post_comment.comment_likes_count -= 1;
              current_post_comment.is_liked_by_user = false;
            }
          }
          this.CommentStateService.updateSingleCommentForPost(current_post_comment);
        }

      },
      (err: any)=>{
        console.log(err);
      }
    )
  }
  delete_comment(comment_id: any){
    this.CommentService.deleteComment(comment_id).subscribe(
      (res: any)=>{
        if(res.deleted){
          this.CommentStateService.deleteSingleCommentForPost(comment_id,this.post_details.post_info._id);
        }
        else{
          console.log(res);
        }
        // console.log(res);
      },
      (err: any)=>{
        console.log(err);
      }
    )
    console.log(comment_id);
  }


  // Edit/Delete Post Feature
  set_post_to_be_deleted(post_id: any){
    this.PostsStateService.setPostToBeDeleted(post_id);
  }
  delete_post(post_details: any){
    this.UpdatePostService.delete_post(this.PostsStateService.getPostToBeDeleted()).subscribe(
      (res: any)=>{
        if(res.deleted){
          // Successfully Deleted Post
          var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            icon: 'success',
            title: 'Post Successfully Deleted'
          })
          setTimeout(()=>{
            // window.location.reload();
            console.log(window.location.origin);
            window.open(window.location.origin+'/client/home',"_self");
            // this.Router.navigateByUrl('../upload');
            
          },1000)
        }
        
      },
      (err: any)=>{
        console.log(err);
      }
    )
  }

  // Edit Post
  set_post_to_be_edited(post_info: any){
    this.PostsStateService.setPostToBeEdited(post_info);
    // console.log(post_info);

  }
}
