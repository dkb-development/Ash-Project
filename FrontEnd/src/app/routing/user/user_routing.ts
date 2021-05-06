import { RouterModule, Routes, Route } from '@angular/router';
import { AuthUserComponent } from '../../components/user/auth-user/auth-user.component';
import { UserSignUpComponent } from '../../components/user/auth-user/user-sign-up/user-sign-up.component';
import { UserLogInComponent } from '../../components/user/auth-user/user-log-in//user-log-in.component';
import { UserHomeComponent } from '../../containers/user_containers/user-home/user-home.component';

export var User_auth_routes: Route[] = [
  { path: 'user/home', component: UserHomeComponent },
  { path: 'auth_user', component: AuthUserComponent },
  { path: 'auth_user/login', component: UserLogInComponent },
  { path: 'auth_user/signup', component: AuthUserComponent },
];


