import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { from } from 'rxjs';

// Services
import { UserPostService } from '../../../services/user_services/user-post.service';
import { AuthService } from '../../../services/user_services/auth.service';
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service';

@Component({
  selector: 'app-user-liked-posts',
  templateUrl: './user-liked-posts.component.html',
  styleUrls: ['./user-liked-posts.component.css']
})
export class UserLikedPostsComponent implements OnInit {

  @Output() 
  newTipPostEvent = new EventEmitter<any>();

  constructor(
    private UserPostService: UserPostService,
    private AuthService: AuthService,
    private CurrentUserStateService: CurrentUserStateService
  ) { }
  liked_posts: any =[];
  is_logged_in : boolean = false;
  liked_post_container_spinner = true;

  ngOnInit(): void {
    this.is_logged_in = this.AuthService.isLoggedIn();
    if(this.is_logged_in){
      // Get Username
      // this.user.username = this.AuthService.getUser().username;

      // Get Userprofile for routing
      this.AuthService.getUserProfile().subscribe(
        (res:any)=>{
          console.log(res);
          var user = res.user_info;
          this.CurrentUserStateService.setCurrentUser(user);

          // Getting Liked Posts
          this.UserPostService.get_liked_posts().subscribe(
            (res: any)=>{
              res.forEach((post_details:any)=>{
                var post = post_details.post_info;
                post.media = post.media.split('?')[0];
                this.liked_posts.push(post_details);
              })
              // this.liked_posts = res;
              // console.log(this.liked_posts);
              this.liked_post_container_spinner = false;
            },(err: any)=>{
              console.log(err);
              this.liked_post_container_spinner = false;

            }
          );
          
        },
        (err: any)=>{
          console.log(err);
        }
      );

      
    }
    else{
      this.liked_post_container_spinner= false;
    }

    var wrapper = $("#wrapper");
    $(window).scroll(function(e) {
      // this.adjustContentTypeContainer();
      let scrollY = window.scrollY;
      if(scrollY > $(window).height()*0.1){
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

  openTipModal(pd: any){
    this.newTipPostEvent.emit(pd);
    // this.tip_post = this.post_details;
    // console.log(this.tip_post);
  }

  post_media_type = "";
  show_posts_of_type(media_type: any){
    this.post_media_type = media_type;
  }

}
