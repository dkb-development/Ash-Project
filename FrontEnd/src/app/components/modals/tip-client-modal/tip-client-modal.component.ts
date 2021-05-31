import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

// Services
import { UserPostService } from '../../../services/user_services/user-post.service';

@Component({
  selector: 'app-tip-client-modal',
  templateUrl: './tip-client-modal.component.html',
  styleUrls: ['./tip-client-modal.component.css']
})
export class TipClientModalComponent implements OnInit {

  constructor(
    private UserPostService: UserPostService
  ) { }

  ngOnInit(): void {
  }

  tipClient(tipPostAmount:any){
    console.log(tipPostAmount.value)
    this.UserPostService.pay_tip_to_client(tipPostAmount.value).subscribe(
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

          $('#tipClientModal').modal('toggle')
          
        },1000)
        console.log(res);
      },
      (err:any)=>{
        console.log(err);
      }
    );


  }

}
