import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

// jQuery
import * as $ from 'jquery';
import * as bootstrap from "bootstrap"

// Datetime picker
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// const socket_io_config: SocketIoConfig = { url: 'http://localhost:5000/', options: {} };


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
import { GetUserInfoService } from './services/client_services/get-user-info.service';
import { MessageService } from './services/message_services/message.service';
import { ChatStateService } from './services/State Services/chat-state.service';
import { ChatSidebarUserCardComponent } from './components/message/chat-sidebar-user-card/chat-sidebar-user-card.component';
import { MyDateAgoPipePipe } from './pipes/my-date-ago-pipe.pipe';
import { ChatSidebarSearchPipe } from './pipes/chat-sidebar-search.pipe';
import { UserChatComponent } from './components/message/user-chat/user-chat.component';
import { PostTypePipe } from './pipes/post-type.pipe';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { ClientFanDetailsService } from './services/State Services/client-fan-details.service';
import { PostsStateService } from './services/State Services/posts-state.service';
import { ClientChangeProfilePictureModalComponent } from './components/modals/client-change-profile-picture-modal/client-change-profile-picture-modal.component';
import { ClientChangeUsernameModalComponent } from './components/modals/client-change-username-modal/client-change-username-modal.component';
import { CurrentUserStateService } from './services/State Services/current-user-state.service';
import { TipClientModalComponent } from './components/modals/tip-client-modal/tip-client-modal.component';
import { CommentService } from './services/comment_services/comment.service';
import { CommentStateService } from './services/State Services/comment-state.service';
import { UpdatePostService } from './services/client_services/update-post.service';



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
    SubscribeModalComponent,
    ChatSidebarUserCardComponent,
    MyDateAgoPipePipe,
    ChatSidebarSearchPipe,
    UserChatComponent,
    PostTypePipe,
    ShortNumberPipe,
    ClientChangeProfilePictureModalComponent,
    ClientChangeUsernameModalComponent,
    TipClientModalComponent,
    // TimeAgoPipe
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    RouterModule,
    // NgxChartsModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // RouterModule.forRoot(appRoutes),
    // SocketIoModule.forRoot(socket_io_config)
  ],
  providers: [FetchPostsService,
              FileUploadService,
              UserPostService,
              AuthService,
              UserPaymentService,
              GetUserInfoService,
              MessageService,
              ChatStateService,
              ClientFanDetailsService,
              PostsStateService,
              CurrentUserStateService,
              CommentService,
              CommentStateService,
              UpdatePostService
              
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
