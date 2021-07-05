import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";

// Services
import { AuthService } from '../../../services/user_services/auth.service';
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service';
import { PostsStateService } from '../../../services/State Services/posts-state.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  constructor(
    private AuthService: AuthService,
    private fb: FormBuilder,
    private Router: Router,
    public CurrentUserStateService: CurrentUserStateService,
    public PostsStateService: PostsStateService,

  ) { }

  is_logged_in : boolean = false;
  logInForm: FormGroup;
  signUpForm: FormGroup;
  user: any = {};
  
  ngOnInit(): void {
    // Get Client Info
    this.AuthService.getClient().subscribe(
      (res: any)=>{
        this.CurrentUserStateService.setClient(res);
        console.log(this.CurrentUserStateService.getClient());
      },
      (err: any)=>{
        console.log(err);
      }
    )

    this.is_logged_in = this.AuthService.isLoggedIn();
    if(this.is_logged_in){
      // Get Username
      this.user.username = this.AuthService.getUser().username;

      // Get Userprofile for routing
      this.AuthService.getUserProfile().subscribe(
        (res:any)=>{
          console.log(res);
          var user = res.user_info;
          this.CurrentUserStateService.setCurrentUser(user);
          if(res.user_info.is_client){
            console.log("Client is Here ...")
            this.Router.navigateByUrl('/client');
          }
        },
        (err: any)=>{
          console.log(err);
        }
      );

      
    }
    else{
      
    }
    


    this.logInForm = this.fb.group({
      // name: ['Sammy', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      // message: ['', [Validators.required, Validators.minLength(15)]],
    });
    
    this.signUpForm = this.fb.group(
      {
      // name: ['Sammy', Validators.required],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    },
    );

    if(window.matchMedia('(max-width: 768px)').matches){
      this.closeNav();
    }

  }

  openChat(){
    console.log("Clicked")
    $('.user_chat_float_container').toggleClass("user_chat_float_container_close")
  }

  
  // Side Navigation
  openNav(){
    console.log("Nav to be opened ...");
    
    if(window.matchMedia('(max-width: 768px)').matches){
      document.getElementById("sidenav").style.width = "80%";
      document.getElementById("contentWrapper").style.marginLeft  = "0%";
      document.getElementById("contentWrapper").style.width = "100%";
      document.getElementById("top_nav").style.width = "100%";
      document.getElementById("close_btn_sidenav").style.marginTop = "5vh";
    }
    else{
      document.getElementById("sidenav").style.width = "20%";
      document.getElementById("contentWrapper").style.marginLeft  = "20%";
      document.getElementById("contentWrapper").style.width = "80%";
      document.getElementById("top_nav").style.width = "80%";
      document.getElementById("close_btn_sidenav").style.marginTop = "0vh";

    }

  }
  closeNav(){
    document.getElementById("sidenav").style.width = "0";
    document.getElementById("contentWrapper").style.width = "100%";
    document.getElementById("contentWrapper").style.marginLeft = "0";
    document.getElementById("top_nav").style.width = "100%";

  }
  toggleNav(){
    console.log(document.getElementById("sidenav").style.width)
    if(document.getElementById("sidenav").style.width=="0px"){
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

  changeNavigation(event: any){
    // console.log($(this));
    // if(!$(this).hasClass('active_sidebar_menu')){
    //   $('.sidenav_menu').removeClass('active_siactive_sidebar_menudebar');
    //   $(this).addClass('active_sidebar_menu');
    // }
    
  }


  // LogIn/SignUp
  serverErrorMessages: string;
  onSubmitLogIn(form: FormGroup){
    if(!form.valid){
      this.shakeModal();
    }
    form.value.email = form.value.email.toLowerCase();
    console.log(form.value);
    this.AuthService.login(form.value).subscribe(
      (res: any)=>{
        this.AuthService.setToken(res['token']);
        this.AuthService.setUser();
        this.Router.navigateByUrl('/');
        this.closeLoginModal();
        window.location.reload();
      },
      (err:any)=>{
          // Email not registered
          this.shakeModal();
          this.serverErrorMessages = err.error.message;
      }
    );
    // console.log('Valid?', form.valid); // true or false
    // console.log('Email', form.value.email);
    // console.log('Password', form.value.password);
  }
  
  onSubmitSignUp(form: FormGroup){
    if(!form.valid){
      this.shakeModal();
    }
    
    this.AuthService.signUp(form.value).subscribe(
      (res: any)=>{
        this.AuthService.setToken(res['token']);
        this.AuthService.setUser();
        this.Router.navigateByUrl('/');
        this.closeRegisterModal();
        window.location.reload();
      },
      (err:any)=>{
          this.shakeModal();
          console.log(err);
          this.serverErrorMessages = err.error.message;
      }
    );
  }
  onLogOut(){
    if(this.is_logged_in){
      this.AuthService.logout();
      this.Router.navigateByUrl('/');
      window.location.reload();
    }
  }
  shakeModal(){
    $('#loginModal .modal-dialog').addClass('shake');
            $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
            $('input[type="password"]').val('');
            setTimeout( function(){ 
                $('#loginModal .modal-dialog').removeClass('shake'); 
    }, 1000 ); 
  }

  showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
      
  }
  showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('Login with');
    });       
    $('.error').removeClass('alert alert-danger').html(''); 
  }

  openLoginModal(){
    this.showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
  }
  closeLoginModal(){
    this.showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('toggle');    
    }, 230);
    
  }
  openRegisterModal(){
    this.showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
  }
  closeRegisterModal(){
    this.showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('toggle');    
    }, 230);
    
  }

  

}
