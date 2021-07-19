import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from "socket.io-client";
import { environment } from '../../../../environments/environment';


import { AuthService } from '../../../services/user_services/auth.service';
import { MessageService } from '../../../services/message_services/message.service';
import { ChatStateService } from '../../../services/State Services/chat-state.service';
import { GetUserProfilePicService } from '../../../services/user_services/get-user-profile-pic.service';
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service';



@Component({
  selector: 'app-client-messaging',
  templateUrl: './client-messaging.component.html',
  styleUrls: ['./client-messaging.component.css']
})
export class ClientMessagingComponent implements OnInit,OnDestroy {
  
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
    private MessageService: MessageService,
    private AuthService: AuthService,
    public ChatStateService: ChatStateService,
    private GetUserProfilePicService: GetUserProfilePicService,
    public CurrentUserStateService: CurrentUserStateService

  ) { 

  }
  user = this.CurrentUserStateService.getCurrentUser();
  chat_with_friend: any={};
  conversations: any;
  current_conversation: any;   
  chat_with_fan_username: any ;
  create_new_conversation = false;
  ngOnInit(): void {
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
    // Socket

    this.socket = io(this.backend_chat_url);
    // Set Socket in the state
    this.ChatStateService.setSocket(this.socket);
    // Add socket in the backend socket server
    this.MessageService.addSocketInServer();
    // Welcome Message from the backend socket server
    this.socket.on("welcome",(msg: any)=>{
      console.log(msg);
    })
    // Get Online users from backend socket server
    this.socket.on("getUsers",(users: any)=>{
      console.log(users);
    })
    // Get messages from backend socket server
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



    this.route.queryParams.subscribe( params => {
      this.chat_with_fan_username = params['username'];
    });

    if(this.chat_with_fan_username){
      this.AuthService.getUserFromUsername(this.chat_with_fan_username).subscribe(
        (user_info: any)=>{
          this.chat_with_friend = user_info;

          // Check if pre existing conversation is there
          this.MessageService.getCommonConversation(this.chat_with_friend._id,this.user._id).subscribe(
            (res: any)=>{
              if(res.conversation == null || res.conversation != undefined){
                console.log("No  Conversation is present")
                 // If no conversation is present then create an conversation
                this.MessageService.createConversation(this.chat_with_friend._id,this.user._id).subscribe(
                  (conv_info: any)=>{
                    // Update the current conversation
                    this.ChatStateService.setCurrentConversation(conv_info);
                  },
                  (err: any)=>{
                    console.log(err);
                  }
                );
              }
              else{
                console.log(" Conversation is present");
                console.log(res);
                // Update the current conversation
                this.ChatStateService.setCurrentConversation(res);
              }
              // Update the conversation list
              this.MessageService.getConversations(this.user._id).subscribe(
                (res: any)=>{
                  this.ChatStateService.setConversationList(res);
                },
                (err: any)=>{
                  console.log(err);
                }
              )
              // Update the messages
              console.log(this.ChatStateService.getCurrentConversation());
              this.MessageService.getMessagesForConversation(this.ChatStateService.getCurrentConversation()._id).subscribe(
                (messages: any)=>{
                  this.ChatStateService.setMessages(messages);
                  this.ChatStateService.messages$.subscribe(
                    (res: any)=>{
                      console.log(res);
                    }
                  )
                },
                (err: any)=>{
                  console.log(err);
                }
              );
              // Update Chatting with friend
              this.MessageService.updateChattingFriendInfo(user_info._id);
            },
            (err: any)=>{
              console.log(err);
            }
          );
          
        },
        (err: any)=>{
          console.log(err);
        }
      )
    }
    
    // Set Conversation List
    this.user = this.AuthService.getUser();
    this.MessageService.getConversations(this.user._id).subscribe(
      (res: any)=>{
        this.ChatStateService.setConversationList(res);
      },
      (err: any)=>{
        console.log(err);
      }
    )

    // Get Current Conversation
    this.ChatStateService.conversation$.subscribe(
      (res:any)=>{
        this.current_conversation = res;
      },
      (err: any)=>{
        console.log(err);
      }
      );
    // this.MessageService.getConversations().subscribe(())
    // this.socket.emit("message","Hi from Frontend");
    // this.socket.on("receive",(msg_from_backend: any)=>{
    //   console.log(msg_from_backend);
    // })



    // this.socket.on("connection",(data: any)=>{
    //   console.log(data);
    // })
    // const socket = io({
    //   query: {
    //     x: 42
    //   }
    // });
    // const socket = io();
    // socket.io.on(,())
    // this.Socket.emit('message', "Hello");
    // console.log("Messaging Component");
    // $('#action_menu_btn').click(function(){
    //   $('.action_menu').toggle();
    // });

    
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
      $('#chat_sidebar').addClass("outside_mobile_view");
    }
    $(".hamberger").click(()=>{ 
      $('#chat_sidebar').removeClass("outside_mobile_view");
      $('#chat_sidebar').addClass("inside_mobile_view");
    })
    $('.close_sidebar_btn').click(()=>{
      $('#chat_sidebar').removeClass("inside_mobile_view");
      $('#chat_sidebar').addClass("outside_mobile_view");
    })
  }

  ngOnDestroy(){
    this.ChatStateService.resetChatState();
  }

}
