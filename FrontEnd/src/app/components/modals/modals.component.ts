import { ChangeDetectorRef, Component, Input, NgZone, OnInit, SimpleChanges } from '@angular/core';
import { UserPaymentService } from '../../services/user_services/user-payment.service';

import { UserPostService } from '../../services/user_services/user-post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {
  @Input()
  tip_post_details: any;

  tip_amount_chosen_by_user: number = 0;

  // ngOnChanges(changes: SimpleChanges) {
  //   this.tip_amount_chosen_by_user = changes.tip_post_details.currentValue.post_info.tip_to_unlock;
  // }

  
  // @Input()
  // post_tip: number;
  // pay_to_unlock_amount = this.UserPaymentService.get_pay_to_unlock_post_amount();
  // status: boolean = false;
  constructor(
    private _cdr: ChangeDetectorRef,
    private UserPaymentService: UserPaymentService,
    private zone:NgZone,
    private UserPostService: UserPostService
  ) { }

  ngOnInit(): void {
    $('#tipToUnlockModal').on('hide.bs.modal', (e)=> {
      this.UserPaymentService.reset_pay_to_unlock_post();
      // console.log(this.UserPaymentService.get_pay_to_unlock_post());
    })
    if(this.tip_post_details){
      console.log(this.tip_post_details);
    }
  }
  
  // changeStatus(): void {
  //   setTimeout(() => {
  //     this.status = true;
  //     this._cdr.detectChanges()
  //   }, 1500);
  // }
  
  openTipToUnlockModal(post_details: any){
    this.UserPaymentService.set_pay_to_unlock_post(post_details);
    $('#tip_to_unlock_amount').val(post_details.post_info.tip_to_unlock);
    this.ngOnInit();
    // this.post_details = this.UserPaymentService.get_pay_to_unlock_post();
    // $('#tip_to_unlock_amount').val(this.post_details.post_info.tip_to_unlock);
    // console.log(this.UserPaymentService.get_pay_to_unlock_post());
    // console.log(this.post_details);
    // this.post_details = post_details;
    // this.tipToUnlockPostAmount = post_details.post_info.tip_to_unlock;
    
    
    // console.log(this.post_details);
    // console.log(this.post_details);
    // this.tipToUnlockPostAmount = post_details.post_info.tip_to_unlock;
    // console.log(this.tipToUnlockPostAmount);
    // this.changeStatus();
    $('#tipToUnlockModal').modal('show');
    
  }

  payToUnlockPost(tipToUnlockForm: any){
    var post_to_unlock_details = {
      post_id: "",
      user_id: "",
      client_id: "",
      tip_amount: 0
    };
    if(tipToUnlockForm.value.tipToUnlockAmount >= this.tip_post_details.post_info.tip_to_unlock){
      post_to_unlock_details.post_id = this.tip_post_details.post_info._id;
      post_to_unlock_details.user_id = this.tip_post_details.user_id;
      post_to_unlock_details.client_id = this.tip_post_details.client_id;
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
    }
    
  }
  tipToPost(tipPostForm:any){
    var post_tip_details = {
      post_id: "",
      user_id: "",
      client_id: "",
      tip_amount: 0
    };

    post_tip_details.post_id = this.tip_post_details.post_info._id;
    post_tip_details.user_id = this.tip_post_details.user_id;
    post_tip_details.client_id = this.tip_post_details.client_id;
    post_tip_details.tip_amount = tipPostForm.value.tip_amount;

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


  }

  

}
