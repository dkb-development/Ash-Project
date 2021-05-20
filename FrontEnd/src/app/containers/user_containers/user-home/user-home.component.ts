import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/user_services/auth.service';
import { Router } from "@angular/router";
import { FetchPostsService } from '../../../services/user_services/fetch-posts.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  constructor(
    private AuthService: AuthService,
    private fb: FormBuilder,
    private Router: Router,
    private FetchPostsService: FetchPostsService
    ) { }

  selected:number = 1;
  filter_type = "";
  is_logged_in : boolean = false;
  logInForm: FormGroup;
  signUpForm: FormGroup;
  user: any = {};
  posts:any = []; 
  post_container_spinner = true;
  tip_to_unlock_post: any = null;
  ngOnInit(): void {
    this.is_logged_in = this.AuthService.isLoggedIn();
    if(this.is_logged_in){
      // Get Username
      this.user.username = this.AuthService.getUser().username;

      // Get Userprofile for routing
      this.AuthService.getUserProfile().subscribe(
        (res:Response)=>{
          if(res.user_info.is_client){
            this.Router.navigateByUrl('/client');
          }
        },
        (err: any)=>{
          console.log(err);
        }
      );

      // Fetch Posts
      this.FetchPostsService.fetch_posts().subscribe(
        (res:any)=>{
          if(res){
            this.post_container_spinner = false;
          }
          console.log(res);
          res.forEach((post_details:any)=>{
            var post = post_details.post_info;
            // console.log(res.is_tip_not_enough,post);
            if(post.media != null){
              post.media = post.media.split('?')[0];
            }
            this.posts.push(post_details);
          })
          // this.posts.forEach((post:any)=>{
          //   console.log("Post media Url : " ,post.media);
          // })
        },
        (err: any)=>{
          console.log(err);
        }
      )
    }
    else{
      this.FetchPostsService.fetch_posts_no_auth().subscribe(
        (res:any)=>{
          if(res){
            this.post_container_spinner = false;
          }
          res.forEach((post:any)=>{
            if(post.media != null){
              post.media = post.media.split('?')[0];
            }
            this.posts.push(post);
          })
          console.log(this.posts);
          // this.posts.forEach((post:any)=>{
          //   console.log("Post media Url : " ,post.media);
          // })
        },
        (err: any)=>{
          console.log(err);
        }
      )
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
  }
  openTipModal(event: any){
    // console.log(event);
    this.tip_to_unlock_post = event;
  }
  // posts = [
  //   {
  //     "name": "post 1",
  //     "type": "image",
  //   },
  //   {
  //     "name": "post 2",
  //     "type": "video",
  //   },
  //   {
  //     "name": "post 3",
  //     "type": "audio",
  //   },
  //   {
  //     "name": "post 4",
  //     "type": "image",
  //   },
  // ];
  set_active(index: number){
    this.selected = index;
  }
  set_filter_type(type: string){
    this.filter_type = type;
  }
   
  
  serverErrorMessages: string;
  onSubmitLogIn(form: FormGroup){
    if(!form.valid){
      this.shakeModal();
    }
    
    this.AuthService.login(form.value).subscribe(
      (res: Response)=>{
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
      (res: Response)=>{
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




  // loginAjax(){
  //   /*   Remove this comments when moving to server
  //   $.post( "/login", function( data ) {
  //           if(data == 1){
  //               window.location.replace("/home");            
  //           } else {
  //               shakeModal(); 
  //           }
  //       });
  //   */

  // /*   Simulate error message from the server   */
  //   this.shakeModal();
  // }
  // loginAjax(){
  //   /*   Remove this comments when moving to server
  //   $.post( "/login", function( data ) {
  //           if(data == 1){
  //               window.location.replace("/home");            
  //           } else {
  //               shakeModal(); 
  //           }
  //       });
  //   */

  // /*   Simulate error message from the server   */
  //   this.shakeModal();
  // }

  

}




interface Response {
  [key: string]: any;
  
}
interface User{
  id: string;
  username: string;
}
