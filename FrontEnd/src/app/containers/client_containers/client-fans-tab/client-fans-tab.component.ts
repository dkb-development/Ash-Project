import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetUserInfoService } from '../../../services/client_services/get-user-info.service';

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
    private Router: Router
  ) { 

  }

  ngOnInit(): void {
    this.GetUserInfoService.getUsers().subscribe(
      (users:any)=>{
        this.fans = users;
        this.fans.forEach((fan: any) => {
          fan.avatar = "https://avatars.dicebear.com/api/human/"+fan.username+".svg";
        });
        console.log(this.fans);
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

}
