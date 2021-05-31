import { Component, OnInit } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AuthService } from '../../../services/user_services/auth.service';
import { Router } from "@angular/router";

// Services
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {

  constructor(
    private AuthService: AuthService,
    private Router: Router,
    public CurrentUserStateService: CurrentUserStateService,
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
      var client = this.AuthService.getUserFromId(this.AuthService.getUser()._id).subscribe(
        (user: any)=>{
          this.CurrentUserStateService.setCurrentUser(user);
          console.log(user);
        },
        (err: any)=>{
          console.log(err)
        }
      )
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

  toggle_side_nav(){
    // About to expand
    if($('body').hasClass('sidebar-collapse')){
      console.log("Sidebar will expand");
      $('.sidenav_profile_stars').css({
        "display":"flex"
      })
    }
    // About to collapse
    else{
      console.log("Sidebar will collapse");
      $('.sidenav_profile_stars').css({
        "display":"none"
      })
    }
    // sidenav_profile_stars
    // 
  }

}


interface Response {
  [key: string]: any;
  
}
interface User{
  id: string;
  username: string;
}
