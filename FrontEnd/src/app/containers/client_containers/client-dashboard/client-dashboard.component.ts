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
      if(window.matchMedia('(max-width: 768px)').matches){
        this.closeNav();
      }
    }
    else{
      // this.Router.navigateByUrl('../');
      console.log("Logged Out");
      console.log(window.location.origin);
      window.open(window.location.origin,"_self");
    }

    if(window.matchMedia('(max-width: 768px)').matches){
      console.log("Mobile Devices for client")
      this.closeNav();
    }
  }
  set_active(index: number){
    this.selected = index;
  }
  onLogOut(){
    if(this.is_logged_in){
      this.AuthService.logout();
      this.Router.navigateByUrl('/user/');
      // window.location.reload();
    }
    
  }

  // Side Navigation
  openNav(){
    console.log("Nav to be opened ...");
    
    if(window.matchMedia('(max-width: 768px)').matches){
      document.getElementById("client_sidenav").style.width = "80%";
      document.getElementById("client_contentWrapper").style.marginLeft  = "0%";
      document.getElementById("client_contentWrapper").style.width = "100%";
      document.getElementById("client_top_nav").style.width = "100%";
      document.getElementById("close_btn_sidenav").style.marginTop = "5vh";
    }
    else{
      document.getElementById("client_sidenav").style.width = "20%";
      document.getElementById("client_contentWrapper").style.marginLeft  = "20%";
      document.getElementById("client_contentWrapper").style.width = "80%";
      document.getElementById("client_top_nav").style.width = "80%";
      document.getElementById("close_btn_sidenav").style.marginTop = "0vh";

    }

  }
  closeNav(){
    document.getElementById("client_sidenav").style.width = "0";
    document.getElementById("client_contentWrapper").style.width = "100%";
    document.getElementById("client_contentWrapper").style.marginLeft = "0";
    document.getElementById("client_top_nav").style.width = "100%";

  }
  toggleNav(){
    console.log(document.getElementById("client_sidenav").style.width)
    if(document.getElementById("client_sidenav").style.width=="0px"){
      this.openNav();
      this.adjustContentTypeContainer();
    }
    else{
      this.closeNav();
      this.adjustContentTypeContainer();
    }
  }
  adjustContentTypeContainer(){
    let scrollY = window.scrollY;
    if(scrollY > $(window).height()*0.9){
      $(".content_type_container").addClass("fixedTop");
      if(document.getElementById("sidenav").style.width!="0px"){
        document.getElementById("content_type_container").classList.add('fixedTopOpenSideNav');
      }
      else{
        document.getElementById("content_type_container").classList.remove('fixedTopOpenSideNav');

      }
    }
    
    else{
      $(".content_type_container").removeClass("fixedTop");
      document.getElementById("content_type_container").classList.remove('fixedTopOpenSideNav');

    }
      // console.log(this.scrollTop);
      // if (this.scrollTop > 500) {
      //   wrapper.addClass("fixedTop");
      // } else {
      //   wrapper.removeClass("fixedTop");
      // }
      
    
  }

}


interface Response {
  [key: string]: any;
  
}
interface User{
  id: string;
  username: string;
}
