import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthUserComponent } from './components/user/auth-user/auth-user.component';
import { UserHomeComponent } from './containers/user_containers/user-home/user-home.component';
import { UserLogInComponent } from './components/user/auth-user/user-log-in/user-log-in.component';
import { UserSignUpComponent } from './components/user/auth-user/user-sign-up/user-sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RouterModule, Routes } from '@angular/router';
import { FilterPostsPipe } from './containers/user_containers/user-home/filter_posts_pipe';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';


// Services
import { FetchPostsService } from './services/user_services/fetch-posts.service';
import { FileUploadService } from './services/client_services/file-upload.service';
import { ClientDashboardComponent } from './containers/client_containers/client-dashboard/client-dashboard.component';
import { ClientHomeComponent } from './containers/client_containers/client-home/client-home.component';
import { ClientUploadComponent } from './containers/client_containers/client-upload/client-upload.component';
import { ClientMessagingComponent } from './containers/client_containers/client-messaging/client-messaging.component';
import { ClientFansTabComponent } from './containers/client_containers/client-fans-tab/client-fans-tab.component';
import { ClientProfileComponent } from './containers/client_containers/client-profile/client-profile.component';
import { ClientFinanceTabComponent } from './containers/client_containers/client-finance-tab/client-finance-tab.component';
import { AuthService } from './services/user_services/auth.service';
import { PostComponent } from './components/post/post.component';
import { UserPostService } from './services/user_services/user-post.service';
import { ModalsComponent } from './components/modals/modals.component';
import { UserPaymentService } from './services/user_services/user-payment.service';
import { SubscribeModalComponent } from './components/subscribe-modal/subscribe-modal.component';



@NgModule({
  declarations: [
    AppComponent,
    AuthUserComponent,
    UserHomeComponent,
    UserLogInComponent,
    UserSignUpComponent,
    ClientDashboardComponent,
    ClientHomeComponent,
    ClientUploadComponent,
    ClientMessagingComponent,
    ClientFansTabComponent,
    ClientProfileComponent,
    ClientFinanceTabComponent,
    FilterPostsPipe,
    PostComponent,
    ModalsComponent,
    SubscribeModalComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    SocialLoginModule,
    RouterModule
    // RouterModule.forRoot(appRoutes),
  ],
  providers: [FetchPostsService,
              FileUploadService,
              UserPostService,
              AuthService,
              UserPaymentService,
              {
                provide: 'SocialAuthServiceConfig',
                useValue: {
                  autoLogin: false,
                  providers: [
                    {
                      id: GoogleLoginProvider.PROVIDER_ID,
                      provider: new GoogleLoginProvider(
                        '1010929154737-iot89lu7gtrftcpejgg2c6dhqhn3kgdp.apps.googleusercontent.com'
                      )
                    }
                  ]
                } as SocialAuthServiceConfig,
              }  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
