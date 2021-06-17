import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { GetUserInfoService } from '../../../services/client_services/get-user-info.service';
import Swal from 'sweetalert2';

// Services
import { ClientFanDetailsService } from '../../../services/State Services/client-fan-details.service';
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service';
import { MessageService } from '../../../services/message_services/message.service';

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
    public ClientFanDetailsService: ClientFanDetailsService,
    private CurrentUserStateService: CurrentUserStateService,
    private MessageService: MessageService
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


  user_list: any = [];
  enable_select_all_btn = false;
  update_user_list(fan_id: any,event: any){
    this.enable_select_all_btn = true;
    if(event.target.checked){
      // Add to the list
      this.user_list.push(fan_id);
      console.log(this.user_list);
    }
    else{
      // Remove from the list
      var index = this.user_list.indexOf(fan_id);
      if(index >= 0){
        this.user_list.splice(index,1);
        if(this.user_list.length == 0){
          this.enable_select_all_btn = false;
          this.schedule_date_time_for_message = null;
        }
      }
      
      console.log(this.user_list);
    }
  }

  select_all_user(){
    $("#user_list_ul > li > .user_checkbox_container > input:checkbox").prop('checked',true);
    this.user_list = []
    this.ClientFanDetailsService.getFanList().forEach((fan: any) => {
      this.user_list.push(fan._id)
    });;
    
  }
  unselect_all_user(){
    $("#user_list_ul > li > .user_checkbox_container > input:checkbox").prop('checked',false);
    this.user_list = []
    this.enable_select_all_btn = false;
    this.schedule_date_time_for_message = null;
  }

  send_schedule_message(schedule_message_body: any){
    if(!this.schedule_date_time_for_message){
      return
    }
    if(!schedule_message_body){
      return
    }
    var message_info = {
      message_text : schedule_message_body.value,
      senderId : this.CurrentUserStateService.getCurrentUser()._id,
      receiverIds : this.user_list,
      schedule_date_time_for_message: this.schedule_date_time_for_message
    }

    this.MessageService.sendScheduleMessage(message_info).subscribe(
      (res: any)=>{
        if(res.success){
          // Successfully Created Post
          var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            icon: 'success',
            title: 'Message scheduled Successfully'
          })
          setTimeout(()=>{
            // window.location.reload();
            console.log(window.location.origin);
            window.open(window.location.origin+'/client/fans_tab',"_self");
            // this.Router.navigateByUrl('../upload');
            
          },1000)
        }
      },
      (err: any)=>{
        console.log(err)
      }
    );
  }


  schedule_date_time_for_message: any = null;
  setScheduleDate(schedule_date_time_input: any){
    this.schedule_date_time_for_message = schedule_date_time_input.value;
    Object.keys(this.schedule_date_time_for_message).forEach((prop: any)=>{
      console.log(prop);
    })
    console.log(this.schedule_date_time_for_message,JSON.stringify(this.schedule_date_time_for_message));
    var sdt = moment(this.schedule_date_time_for_message);
    console.log(sdt.format('YYYY-MM-DD'))
    console.log(sdt.format('LT'))

  }

}
