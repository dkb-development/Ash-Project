import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetUserInfoService } from '../../../services/client_services/get-user-info.service';

// Services
import { ClientFanDetailsService } from '../../../services/State Services/client-fan-details.service';

@Component({
  selector: 'app-client-fans-tab',
  templateUrl: './client-fans-tab.component.html',
  styleUrls: ['./client-fans-tab.component.css']
})
export class ClientFansTabComponent implements OnInit {
  fans: any;
  fan_details: any;
  avatar = "https://avatars.dicebear.com/api/:sprites/"
  constructor(
    private GetUserInfoService: GetUserInfoService,
    private Router: Router,
    public ClientFanDetailsService: ClientFanDetailsService
  ) { 

  }

  client_fans_loader_spinner = true;
  ngOnInit(): void {
    this.GetUserInfoService.getUsers().subscribe(
      (users:any)=>{
        this.fans = users.map((usr: any)=>{
          return usr.user;
        });
        this.fans.forEach((fan: any) => {
          fan.avatar = "https://avatars.dicebear.com/api/human/"+fan.username+".svg";
        });
        for(let i=0;i<users.length;i++){
          this.fans[i].total_tip = users[i].total_tip;
        }
        this.ClientFanDetailsService.setFanList(this.fans);
        this.client_fans_loader_spinner = false;
      },
      (err: any)=>{
        console.log("Error : ",err);
      }
    )
    
    // $(document).ready(function () {
    //   $('#dtBasicExample').DataTable();
    //   $('.dataTables_length').addClass('bs-select');
    // });
  }
  showFanDetails(fan: any){
      this.fan_details = fan;
  }
  message_with_fan(fan: any){
    var uri = "client/messaging"+"?username="+fan.username;
    this.Router.navigateByUrl(uri);
  }

  restrict_user(user_details: any){
    this.GetUserInfoService.restrictUser(user_details).subscribe(
      (res: any)=>{
        user_details.is_restricted = res.is_restricted;
        this.ClientFanDetailsService.updateFanDetails(user_details);
      },
      (err: any)=>{
        console.log(err);
      }
    )
  }

  remove_restric_user(user_details: any){
    this.GetUserInfoService.removeRestrictUser(user_details).subscribe(
      (res: any)=>{
        user_details.is_restricted = res.is_restricted;
        this.ClientFanDetailsService.updateFanDetails(user_details);
      },
      (err: any)=>{
        console.log(err);
      }
    )
  }

  block_user(user_details: any){
    this.GetUserInfoService.blockUser(user_details).subscribe(
      (res: any)=>{
        user_details.is_blocked = res.is_blocked;
        this.ClientFanDetailsService.updateFanDetails(user_details);
      },
      (err: any)=>{
        console.log(err);
      }
    )
  }

  unblock_user(user_details: any){
    this.GetUserInfoService.unblockUser(user_details).subscribe(
      (res: any)=>{
        user_details.is_blocked = res.is_blocked;
        this.ClientFanDetailsService.updateFanDetails(user_details);
      },
      (err: any)=>{
        console.log(err);
      }
    )
  }

}
