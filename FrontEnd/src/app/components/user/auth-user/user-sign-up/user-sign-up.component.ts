import { Component, OnInit } from '@angular/core';
import { UserSignUpService } from 'src/app/services/user_services/user-sign-up.service';
import { User } from '../../../../models/user';



@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrls: ['./user-sign-up.component.css']
})
export class UserSignUpComponent implements OnInit {

  constructor(
    private _UserSignUpService : UserSignUpService ,
    
    ) { }
  
  newUser = new User();
  ngOnInit( ): void {
    
    this.newUser.username = "dkb";
    this.newUser.email = "dkb@gmail.com";
    this.newUser.password = "123";
  }
  // user_signup_form ;
  

  onSubmit(){
    this._UserSignUpService.signUp(this.newUser)
      .subscribe(
        (data)=>{console.log(data);},
        (error)=>{console.log(error);}
      )
  }

  
  

}
