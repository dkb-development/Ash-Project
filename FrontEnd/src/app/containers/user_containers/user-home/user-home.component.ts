import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";


// Services
import { AuthService } from '../../../services/user_services/auth.service';
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service';
import { PostsStateService } from '../../../services/State Services/posts-state.service';
import { FetchPostsService } from '../../../services/user_services/fetch-posts.service';




@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  constructor(
    private AuthService: AuthService,
    private Router: Router,
    public CurrentUserStateService: CurrentUserStateService,
    public PostsStateService: PostsStateService,
    private FetchPostsService: FetchPostsService,
    
    
    ) { }

  filter_type = "";
  selected:number = 1;
  tip_to_unlock_post: any = null;
  post_container_spinner = true;
  logInForm: FormGroup;
  signUpForm: FormGroup;
  is_logged_in : boolean = false;
  user: any = {};
  posts:any = []; 




  ngOnInit(): void {

    this.is_logged_in = this.AuthService.isLoggedIn();
    if(this.is_logged_in){
      // Get Username
      this.user.username = this.AuthService.getUser().username;

      // Get Userprofile for routing
      this.AuthService.getUserProfile().subscribe(
        (res:Response)=>{
          console.log(res);
          var user = res.user_info;
          this.CurrentUserStateService.setCurrentUser(user);
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

          // Set Posts State
          this.PostsStateService.setPostsList(this.posts);

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
      // Fetch Posts for not logged in Users
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

          // Set Posts State
          this.PostsStateService.setPostsList(this.posts);
          
          // this.posts.forEach((post:any)=>{
          //   console.log("Post media Url : " ,post.media);
          // })
        },
        (err: any)=>{
          console.log(err);
        }
      )
    }

    


    // Height adjustment of parent element
    
    // var chile_height = $('.client_cover_image_container').height()
    // console.log(chile_height)
    // $('.client_cover_container').height(chile_height);
    // console.log($('.client_cover_container').height());

    var wrapper = $("#wrapper");
    $(window).scroll(function(e) {
      // this.adjustContentTypeContainer();
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
        $(".content_type_container")?.removeClass("fixedTop");
        document.getElementById("content_type_container")?.classList.remove('fixedTopOpenSideNav');

      }
      // console.log(this.scrollTop);
      // if (this.scrollTop > 500) {
      //   wrapper.addClass("fixedTop");
      // } else {
      //   wrapper.removeClass("fixedTop");
      // }
      
    });
  }
  openChat(){
    console.log("Clicked")
    $('.user_chat_float_container').toggleClass("user_chat_float_container_close")
  }
  openTipModal(event: any){
    // console.log(event);
    
    this.tip_to_unlock_post = event;
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

  

  

  

  post_media_type = "";
  show_posts_of_type(media_type: any){
    this.post_media_type = media_type;
  }

  set_filter_type(type: string){
    this.filter_type = type;
  }

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




interface Response {
  [key: string]: any;
  
}
interface User{
  id: string;
  username: string;
}
