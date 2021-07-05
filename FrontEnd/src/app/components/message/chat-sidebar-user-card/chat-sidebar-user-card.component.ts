import { Component, Input, OnInit } from '@angular/core';

import { MessageService } from '../../../services/message_services/message.service';
import { ChatStateService } from '../../../services/State Services/chat-state.service';
import { AuthService } from '../../../services/user_services/auth.service';
import { GetUserProfilePicService } from '../../../services/user_services/get-user-profile-pic.service';

import * as moment from 'moment';

@Component({
  selector: 'app-chat-sidebar-user-card',
  templateUrl: './chat-sidebar-user-card.component.html',
  styleUrls: ['./chat-sidebar-user-card.component.css']
})
export class ChatSidebarUserCardComponent implements OnInit {
  @Input()
  conversation_info: any;
  constructor(
    private MessageService: MessageService,
    public ChatStateService: ChatStateService,
    private AuthService: AuthService,
    public GetUserProfilePicService: GetUserProfilePicService
  ) { }

  user: any;
  chatting_friend: any;
  ngOnInit(): void {
    console.log(this.conversation_info);
    this.user = this.AuthService.getUser();
    for(var member of this.conversation_info.members){
      if(member != this.user._id){
        this.AuthService.getUserFromId(member).subscribe(
          (res: any)=>{
            res.profile_picture = res.profile_picture?.split('?')[0];
            this.chatting_friend = res;
            console.log(this.chatting_friend);
          },
          (err: any)=>{
            console.log(err);
          }
        )
        break;
      }
    }
  }

  showConversationMessages(){
    this.ChatStateService.setCurrentConversation(this.conversation_info);
    // this.MessageService.updateChattingFriendInfo(()=>{
    //   for(var member of this.conversation_info.members){
    //     if(member != this.user._id){
    //       console.log(member);
    //       return member;
    //     }
    //   }
    // })
    
    for(var member of this.conversation_info.members){
      if(member != this.user._id){
        this.MessageService.updateChattingFriendInfo(member);
        break;
      }
    }
    this.ChatStateService.chattting_friend$.subscribe(
      (res: any)=>{
        // console.log(res);
      },
      (err: any)=>{
        console.log(err);
      }
    )
    this.MessageService.getMessagesForConversation(this.conversation_info._id).subscribe(
      (res: any)=>{
        // console.log(res);
        // res.forEach((message: any) => {
        //   message.createdAt = moment(message.createdAt).fromNow()
        // });
        this.ChatStateService.setMessages(res);

        // For mobile devices
        if($(window).width()<760){
          $('#chat_sidebar').removeClass("inside_mobile_view");
          $('#chat_sidebar').addClass("outside_mobile_view");
        }
      },
      (err: any)=>{
        console.log(err);
      }
    );
  } 

}
