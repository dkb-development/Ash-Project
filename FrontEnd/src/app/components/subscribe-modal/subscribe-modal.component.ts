import { Component, OnInit } from '@angular/core';

import { UserPaymentService } from '../../services/user_services/user-payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscribe-modal',
  templateUrl: './subscribe-modal.component.html',
  styleUrls: ['./subscribe-modal.component.css']
})
export class SubscribeModalComponent implements OnInit {
  subscription_fee_per_month = this.UserPaymentService.get_subscription_fee();
  constructor(
    private UserPaymentService: UserPaymentService
  ) { }

  ngOnInit(): void {
    $('#subscribeModal').on('show.bs.modal', (e)=> {
      console.log("Opened");
    })
    $('#subscribeModal').on('hide.bs.modal', (e)=> {
      console.log("Closed");
    })
    // if($("#subscribeModal").hasClass('in')){
    //   console.log("Modal Open");
    // }
    // else{
    //   console.log("Closed");
    // }
  }
  pay_to_subscribe(){
    this.UserPaymentService.pay_to_subscribe().subscribe(
      (res: any)=>{
        var Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          icon: 'success',
          title: 'Successfully Payment Done and Subscribed'
        })
        setTimeout(()=>{
          // window.location.reload();
          console.log(window.location.origin);
          window.open(window.location.origin+'',"_self");
          // this.Router.navigateByUrl('../upload');
          
        },1000)
        console.log(res);
      },  
      (err: any)=>{ 
        console.log(err);
      }
    )
  }

}
