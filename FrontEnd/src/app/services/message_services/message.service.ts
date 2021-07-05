import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../user_services/auth.service';
import { ChatStateService } from '../State Services/chat-state.service';
import { GetUserProfilePicService } from '../user_services/get-user-profile-pic.service';

import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient,
    private AuthService: AuthService,
    private ChatStateService: ChatStateService,
    private GetUserProfilePicService: GetUserProfilePicService
  ) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  authHeaders = { headers: new HttpHeaders().set("Authorization", "Bearer " + this.AuthService.getToken()) }

  getConversations(user_id: any){
    try {
      // console.log(this.authHeaders);
      var conversation_url = environment.apiBaseUrl + 'conversations/get_conversation/'+user_id;
      return this.http.get(conversation_url, this.authHeaders);
      
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }

  getCommonConversation(user1_id: any,user2_id: any){
    try {
      // console.log(this.authHeaders);
      var url = environment.apiBaseUrl + 'conversations/get_conversation/'+user1_id+"/"+user2_id;
      var res = this.http.get(url, this.authHeaders);
      return res;
      
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }

  createConversation(user1_id: any,user2_id: any){
    try {
      // console.log(this.authHeaders);
      var conversation_info = {
        "senderId" : user1_id,
        "receiverId": user2_id
      }
      var url = environment.apiBaseUrl + 'conversations/create_conversation';
      var res = this.http.post(url,conversation_info, this.authHeaders);
      return res;
      
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }
  
  getMessagesForConversation(conversation_info: any){
    try {
      // console.log(this.authHeaders);
      var conversation_url = environment.apiBaseUrl + 'messages/get_messages_for_converation/'+conversation_info;
      var res = this.http.get(conversation_url, this.authHeaders);
      return res;
      
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }

  sendMessage(message_info: any){
    try {
      // console.log(this.authHeaders);
      var url = environment.apiBaseUrl + 'messages';
      var res = this.http.post(url,message_info, this.authHeaders);
      return res;
      
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }

  updateChattingFriendInfo(chatting_friend_id: any){
    this.AuthService.getUserFromId(chatting_friend_id).subscribe(
      (chatting_friend_info: any)=>{
        
        var chatting_friend_info_with_avatar = {
          ...chatting_friend_info,
          "avatar": this.GetUserProfilePicService.getProfilePicUrlFromUsername(chatting_friend_info.username)
        }
        this.ChatStateService.setChattingFriend(chatting_friend_info_with_avatar);
        
      },
      (err: any)=>{
        console.log(err);
      }
    )
  }

  addSocketInServer(){
    var socket = this.ChatStateService.getSocket();
    var user = this.AuthService.getUser();
    var socket = this.ChatStateService.getSocket();
    console.log(socket);
    socket.emit("addSocketInServer",{
      "user_id": user._id,
      "username": user.username
    })
  }

  sendScheduleMessage(message_info: any){
    try {
      // console.log(message_info);
      var url = environment.apiBaseUrl + 'messages/schedule_message';
      var res = this.http.post(url,message_info, this.authHeaders);
      return res;
      
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }

}
