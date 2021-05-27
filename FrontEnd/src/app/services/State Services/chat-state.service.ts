import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ChatStateService {
  private readonly _conversation = new BehaviorSubject<any>([]);
  public conversation$ = this._conversation.asObservable();

  private readonly _conversation_list = new BehaviorSubject<any>([]);
  public conversation_list$ = this._conversation_list.asObservable();

  private readonly _messages = new BehaviorSubject<any>([]);
  public messages$ = this._messages.asObservable();

  private readonly _chattting_friend = new BehaviorSubject<any>([]);
  public chattting_friend$ = this._chattting_friend.asObservable();

  private readonly _socket_info = new BehaviorSubject<any>([]);
  public socket_info$ = this._socket_info.asObservable();

  constructor(
  ) { }

  setConversationList(conversation_list: any){
    this._conversation_list.next(conversation_list);
  }
  getConversationList(){
    return this._conversation_list.getValue();
  }
  setCurrentConversation(conversation_info: any){
    this._conversation.next(conversation_info);
  }
  setMessages(message_list: any){
    this._messages.next(message_list);
  }
  appendMessage(message_info: any){
    var messages = this._messages.getValue();
    var added_messages = [...messages,message_info];
    this._messages.next(added_messages);
  }
  // getLastMessage(conversation_info: any){
  //   var messages = this._messages.getValue();
  //   messages.sort((a: any,b: any)=>{
  //     return (a.updatedAt - b.updatedAt);
  //   })
  //   return messages[0];
  // }
  

  setChattingFriend(chatting_friends_info: any){
    this._chattting_friend.next(chatting_friends_info);
  }
  getChattingFriend(){
    return this._chattting_friend.getValue();
  }
  getCurrentConversation(){
    return this._conversation.getValue();
  }

  setSocket(socket_info: any){
    this._socket_info.next(socket_info);
  }
  getSocket(){
    return this._socket_info.getValue();
  }



  resetChatState(){
    this._conversation.next([]);
    this._conversation_list.next([]);
    this._messages.next([]);
    this._socket_info.next([]);
  }
}
