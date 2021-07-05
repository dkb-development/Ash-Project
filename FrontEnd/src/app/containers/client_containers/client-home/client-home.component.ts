import { Component, OnInit } from '@angular/core';
import { FetchPostsService } from '../../../services/user_services/fetch-posts.service';

// Services
import { PostsStateService } from '../../../services/State Services/posts-state.service';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {

  constructor(
    private FetchPostsService: FetchPostsService,
    private PostsStateService: PostsStateService
    ) { }
  posts:any = [];
  post_container_spinner = true;
  ngOnInit(): void {
    this.FetchPostsService.fetch_posts().subscribe(
      (res:any)=>{
        if(res){
          this.post_container_spinner = false;
        }
        // console.log(res);
        res.forEach((post_details:any)=>{
          var post = post_details.post_info;
          post.media = post.media.split('?')[0];
          this.posts.push(post_details);
        })
        
        // this.posts.forEach((post:any)=>{
        //   console.log("Post media Url : " ,post.media);
        // })
        this.PostsStateService.setPostsList(this.posts);

      },
      (err: any)=>{
        console.log(err);
      }
    )

    var wrapper = $("#wrapper");
    $(window).scroll(function(e) {
      // this.adjustContentTypeContainer();
      let scrollY = window.scrollY;
      if(scrollY > $(window).height()*0.1){
        $(".content_type_container").addClass("fixedTop");
        if(document.getElementById("sidenav").style.width!="0px"){
          document.getElementById("content_type_container")?.classList.add('fixedTopOpenSideNav');
        }
        else{
          document.getElementById("content_type_container")?.classList.remove('fixedTopOpenSideNav');

        }
      }
      
      else{
        $(".content_type_container").removeClass("fixedTop");
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

  post_media_type = "";
  show_posts_of_type(media_type: any){
    this.post_media_type = media_type;
  }

  

}
