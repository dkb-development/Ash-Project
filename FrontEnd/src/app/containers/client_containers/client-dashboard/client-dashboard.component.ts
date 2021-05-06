import { Component, OnInit } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AuthService } from '../../../services/user_services/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {

  constructor(
    private AuthService: AuthService,
    private Router: Router,
  ) { }
  selected:number = 1;
  is_logged_in = false;
  user: any = {};
  ngOnInit(): void {
    this.is_logged_in = this.AuthService.isLoggedIn();
    if(this.is_logged_in){
      this.user.username = this.AuthService.getUser().username;
      this.Router.navigateByUrl('/client');
      this.user.username = this.AuthService.get_username();
    }
    else{
      // this.Router.navigateByUrl('../');
      console.log("Logged Out");
      console.log(window.location.origin);
      window.open(window.location.origin,"_self");
    }
  }
  set_active(index: number){
    this.selected = index;
  }
  onLogOut(){
    if(this.is_logged_in){
      this.AuthService.logout();
      this.Router.navigateByUrl('../');
      window.location.reload();
    }
    
  }

}


interface Response {
  [key: string]: any;
  
}
interface User{
  id: string;
  username: string;
}
