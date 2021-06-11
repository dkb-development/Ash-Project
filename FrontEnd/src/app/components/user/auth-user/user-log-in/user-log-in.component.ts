import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/user_services/auth.service';

@Component({
  selector: 'app-user-log-in',
  templateUrl: './user-log-in.component.html',
  styleUrls: ['./user-log-in.component.css']
})
export class UserLogInComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder, 
    private AuthService: AuthService,
  ) { }

  loginForm: FormGroup;
  isLoggedin: boolean = false; 
  
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });    
    
    // this.socialAuthService.authState.subscribe((user) => {
    //   this.AuthService.setUser();
      
    //   // this.socialUser = user;
    //   // this.isLoggedin = (user != null);
    //   // this.isLoggedin = (user.email == this.AuthService.getUser());
    //   console.log(user);
    // });
  }

  // loginWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  // logOut(): void {
  //   this.socialAuthService.signOut();
  // }

}
