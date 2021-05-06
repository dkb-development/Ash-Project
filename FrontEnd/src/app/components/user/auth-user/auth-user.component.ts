import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { NgForm } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/user_services/auth.service';
import { Router } from "@angular/router";
import { User } from 'src/app/models/user';

// import * as $ from 'jquery';


@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.css']
})
export class AuthUserComponent implements OnInit {

  logInForm: FormGroup;
  signUpForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private Router:Router,
    ) { }

  ngOnInit(): void {
    
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
  // password_match()
 
  new_user_logIn = {
    email: "",
    password: ""
  };


  serverErrorMessages: string;
  onSubmitLogIn(form: FormGroup){
    if(!form.valid){
      this.shakeModal();
    }
    
    this.AuthService.login(form.value).subscribe(
      (res: Response)=>{
        this.AuthService.setToken(res['token']);
        this.Router.navigateByUrl('/');
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
  new_user_signUp = {
    email: "",
    username: "",
    password: ""
  };
  onSubmitSignUp(form: FormGroup){
    console.log(form.value);
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
  openRegisterModal(){
    this.showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
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

  

}

interface Response {
  [key: string]: any;
  
}
