import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-client-messaging',
  templateUrl: './client-messaging.component.html',
  styleUrls: ['./client-messaging.component.css']
})
export class ClientMessagingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#action_menu_btn').click(function(){
      $('.action_menu').toggle();
    });
  }

  

}
