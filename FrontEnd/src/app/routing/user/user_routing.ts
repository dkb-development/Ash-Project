import { RouterModule, Routes, Route } from '@angular/router';
import { AuthUserComponent } from '../../components/user/auth-user/auth-user.component';
import { UserSignUpComponent } from '../../components/user/auth-user/user-sign-up/user-sign-up.component';
import { UserLogInComponent } from '../../components/user/auth-user/user-log-in//user-log-in.component';
import { UserHomeComponent } from '../../containers/user_containers/user-home/user-home.component';
import { UserLikedPostsComponent } from '../../containers/user_containers/user-liked-posts/user-liked-posts.component';
import { UserProfileSettingsComponent } from 'src/app/containers/user_containers/user-profile-settings/user-profile-settings.component';
import { UserDashboardComponent } from 'src/app/containers/user_containers/user-dashboard/user-dashboard.component';
import { UserMessagingComponent } from 'src/app/containers/user_containers/user-messaging/user-messaging.component';

export var User_auth_routes: Route[] = [
  // { path: '', component: UserDashboardComponent },
  // { path: 'user/home', component: UserHomeComponent },
  // { path: 'auth_user', component: AuthUserComponent },
  // { path: 'auth_user/login', component: UserLogInComponent },
  // { path: 'auth_user/signup', component: AuthUserComponent },
  // { path: 'liked_posts', component: UserLikedPostsComponent },
  // { path: 'profile', component: UserProfileSettingsComponent },
  // { path: '**', redirectTo: '' }, 
  {
    path: 'user',
        component: UserDashboardComponent ,
        children: [
          { path: 'home', component: UserHomeComponent },
          { path: 'liked_posts', component: UserLikedPostsComponent },
          { path: 'messaging', component: UserMessagingComponent },
          { path: 'profile', component: UserProfileSettingsComponent },
          { path: '**', redirectTo: 'home' }, 
        ]
  }



];


