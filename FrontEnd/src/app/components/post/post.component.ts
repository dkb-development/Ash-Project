import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from '../../services/user_services/auth.service';
import { UserPostService } from '../../services/user_services/user-post.service';
import Swal from 'sweetalert2';
import { UserPaymentService } from '../../services/user_services/user-payment.service';

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
    private UserPaymentService: UserPaymentService
  ) { }

  dt:any;
  tm:any;
  is_logged_in:boolean;
  tipToUnlockPostAmount:number = 0;
  tip_post:any = null;
  ngOnInit(): void {
    // console.log(this.post_details);
    this.is_logged_in = this.AuthService.isLoggedIn();
    var dt = moment(this.post_details.date_created);
    this.dt = dt.format('YYYY-MM-DD');
    this.tm = dt.format('LT');


    $('#tipToUnlockModal').on('hide.bs.modal', (e)=> {
      this.tipToUnlockPostAmount = 0;
    })
    $('#tipModal').on('hide.bs.modal', (e)=> {
      this.tip_post = null;
    })
    
  }

  // Like/Dislike Feature
  likeOrDislikePost(pd: any){
    // console.log(pd);
    this.UserPostService.like_or_dislike_post(pd).subscribe(
      (res: any)=>{
        this.post_details.is_liked = res.is_liked
        
        console.log(res);
      },
      (err: any)=>{
        console.log(err);
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
}
