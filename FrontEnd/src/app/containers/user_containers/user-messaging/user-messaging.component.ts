import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { io } from "socket.io-client";
import { ActivatedRoute } from '@angular/router';



// Services
import { ChatStateService } from '../../../services/State Services/chat-state.service';
import { MessageService } from '../../../services/message_services/message.service';
import { AuthService } from '../../../services/user_services/auth.service';
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service';


@Component({
  selector: 'app-user-messaging',
  templateUrl: './user-messaging.component.html',
  styleUrls: ['./user-messaging.component.css']
})
export class UserMessagingComponent implements OnInit {

  socket: any;
  backend_chat_url = environment.chatSocketUrl;

  // Scroll TO bottom Feature
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } 
    catch(err) { }                 
  }

  constructor(
    private route: ActivatedRoute,
    public ChatStateService: ChatStateService,
    private MessageService: MessageService,
    private AuthService: AuthService,
    public CurrentUserStateService: CurrentUserStateService


  ) { }

  user = this.CurrentUserStateService.getCurrentUser();
  chat_with_friend: any={};
  conversations: any;
  current_conversation: any;   
  chat_with_fan_username: any ;
  create_new_conversation = false;
  current_chatting_friend: any;
  async ngOnInit() {
    this.CurrentUserStateService.current_user$.subscribe(
      (res: any)=>{
        this.user = res;
        console.log(this.user);
        return res;
      },
      (err: any)=>{
        console.log(err);
      }
    );
    this.socket = io(this.backend_chat_url);
    // Set Socket in the state
    this.ChatStateService.setSocket(this.socket);

    // Add socket in the backend socket server
    this.MessageService.addSocketInServer();

    this.socket.on("welcome",(msg: any)=>{
      console.log(msg);
    })
  
    this.socket.on("getUsers",(users: any)=>{
      console.log(users);
    })

    this.socket.on("getMessage",(msg_info: any)=>{
      var new_message = {
        "conversationId": this.ChatStateService.getCurrentConversation()._id,
        "sender": msg_info.sender_id,
        "message_text": msg_info.message_text,
        "createdAt": Date.now()
      }

      if(new_message.sender == this.ChatStateService.getChattingFriend()._id){
        this.ChatStateService.appendMessage(new_message);
      }
      
      
    })

    // Set Conversation List
    var conv_list_set = await new Promise((resolve,reject)=>{
      this.MessageService.getConversations(this.user._id).subscribe(
        (res: any)=>{
          this.ChatStateService.setConversationList(res);
          console.log(res);

          resolve(true);
        },
        (err: any)=>{
          console.log(err);
        }
        
      )
      
    })
    // Set Current Conversation in the state
    var current_conv_set: any;
    if(conv_list_set){
      console.log(this.ChatStateService.getConversationList());
      current_conv_set = await new Promise((resolve,reject)=>{
        this.ChatStateService.setCurrentConversation(this.ChatStateService.getConversationList()[0]);
        console.log(this.ChatStateService.getCurrentConversation())
        resolve(true)
      })
    }
    console.log(this.ChatStateService.getCurrentConversation());
    
    // Get Current Conversation from the state and set the local variable here
    var set_current_conv;
    if(current_conv_set){
      // Get Current Conversation
      set_current_conv = await new Promise((resolve,reject)=>{
        this.ChatStateService.conversation$.subscribe(
          (res:any)=>{
            this.current_conversation = res;
          },
          (err: any)=>{
            console.log(err);
          }
        );
        resolve(true);
      })
    }
    
    // Set chatting friend
    var set_chatting_friend;
    if(set_current_conv){
      set_chatting_friend = await new Promise((resolve,reject)=>{
        for(var member of this.ChatStateService.getCurrentConversation().members){
          if(member != this.user._id){
            this.AuthService.getUserFromId(member).subscribe(
              (res: any)=>{
                this.current_chatting_friend = res;
                this.MessageService.updateChattingFriendInfo(res._id);
                resolve(true);
              },
              (err: any)=>{
                console.log(err);
              }
            )
            break;
          }
        }
      })
      
    }

    // Set messages for the conversation
    var set_messages;
    if(set_chatting_friend){
      set_messages = await new Promise((resolve,reject)=>{
        this.MessageService.getMessagesForConversation(this.ChatStateService.getCurrentConversation()._id).subscribe(
          (messages: any)=>{
            this.ChatStateService.setMessages(messages);
            this.ChatStateService.messages$.subscribe(
              (res: any)=>{
                console.log(res);
              }
            )
            resolve(true);
          },
          (err: any)=>{
            console.log(err);
          }
        );
      })
    }

    this.adjust_sidebar_for_mobile();
    $(window).resize(this.adjust_sidebar_for_mobile);
  }

  send_message(message_to_be_sent_text: any){
    if(message_to_be_sent_text.value == ""){
      return
    }
    var new_message = {
      "conversationId" : this.current_conversation._id,
      "sender" : this.user._id,
      "message_text" : message_to_be_sent_text.value
    }
    message_to_be_sent_text.value = "";

    this.MessageService.sendMessage(new_message).subscribe(
      (res:any)=>{
        this.ChatStateService.appendMessage(res);

        // Send message to socket server
        var message_to_socket_server = {
          "senderId": this.user._id,
          "receiverId": this.ChatStateService.getChattingFriend()._id,
          "text": new_message.message_text,
        }
        console.log(message_to_socket_server);
        this.socket.emit("sendMessage",message_to_socket_server);
      },
      (err: any)=>{
        console.log(err);
      }

    )
  }

  adjust_sidebar_for_mobile(){
    if($(window).width()<760){
      $('#user_chat_sidebar').addClass("outside_mobile_view");
    }
    $(".hamberger").click(()=>{ 
      $('#user_chat_sidebar').removeClass("outside_mobile_view");
      $('#user_chat_sidebar').addClass("inside_mobile_view");
    })
    $('.close_sidebar_btn').click(()=>{
      $('#user_chat_sidebar').removeClass("inside_mobile_view");
      $('#user_chat_sidebar').addClass("outside_mobile_view");
    })
  }

  ngOnDestroy(){
    this.ChatStateService.resetChatState();
  }

}
