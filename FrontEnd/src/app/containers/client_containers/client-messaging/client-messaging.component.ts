import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from "socket.io-client";

@Component({
  selector: 'app-client-messaging',
  templateUrl: './client-messaging.component.html',
  styleUrls: ['./client-messaging.component.css']
})
export class ClientMessagingComponent implements OnInit {
  socket: any;
  url = "http://localhost:5000/";
  chat_with_fan: any ;
  constructor(
    private route: ActivatedRoute
  ) { 
    this.socket = io(this.url);
    this.route.queryParams.subscribe( params => {
      // this.orgstructure = params.get('orgstructure'); 
      console.log(params['username']);   
      this.chat_with_fan = params['username'];
    });
  }

  ngOnInit(): void {
    if(this.chat_with_fan){
      console.log(this.chat_with_fan);
    }


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

  

}
