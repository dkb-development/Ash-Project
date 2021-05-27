import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from "socket.io-client";
import { environment } from '../../../../environments/environment';

// Services
import { AuthService } from '../../../services/user_services/auth.service';
import { ChatStateService } from '../../../services/State Services/chat-state.service';
import { MessageService } from '../../../services/message_services/message.service';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css']
})
export class UserChatComponent implements OnInit {
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

  socket: any;
  backend_chat_url = environment.chatSocketUrl;
  constructor(
    private AuthService: AuthService,
    public ChatStateService: ChatStateService,
    private MessageService: MessageService
  ) {   }

  user = this.AuthService.getUser();
  current_conversation: any;
  current_chatting_friend: any;
  async ngOnInit() {
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
      current_conv_set = await new Promise((resolve,reject)=>{
        this.ChatStateService.setCurrentConversation(this.ChatStateService.getConversationList()[0]);
        console.log(this.ChatStateService.getCurrentConversation())
        resolve(true)
      })
    }
    
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
        for(var member of this.current_conversation.members){
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
    
    
    this.adjust_user_chat_for_mobile();
    $(window).resize(this.adjust_user_chat_for_mobile);
    
  }
  
  send_message(message_to_be_sent_text: any){
    if(message_to_be_sent_text.value == ""){
      return;
    }
    var new_message = {
      "conversationId" : this.current_conversation._id,
      "sender" : this.user._id,
      "message_text" : message_to_be_sent_text.value
    }
    this.MessageService.sendMessage(new_message).subscribe(
      (res:any)=>{
        this.ChatStateService.appendMessage(res);
        message_to_be_sent_text.value = "";
        
        // Send message to socket server
        var message_to_socket_server = {
          "senderId": this.user._id,
          "receiverId": this.current_chatting_friend._id,
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

  toggle_user_chat_container(){
    console.log("Clicked")
    $('.user_chat_float_container').toggleClass("user_chat_float_container_close")
  }
  adjust_user_chat_for_mobile(){

  }
}
