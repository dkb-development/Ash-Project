import { Component, OnInit } from '@angular/core';
import { FetchPostsService } from '../../../services/user_services/fetch-posts.service';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {

  constructor(private FetchPostsService: FetchPostsService) { }
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
      },
      (err: any)=>{
        console.log(err);
      }
    )
    
  }
  // posts = [
  //   {
  //     "name": "post 1",
  //     "type": "image",
  //   },
  //   {
  //     "name": "post 2",
  //     "type": "video",
  //   },
  //   {
  //     "name": "post 3",
  //     "type": "audio",
  //   },
  //   {
  //     "name": "post 4",
  //     "type": "image",
  //   },
  // ];

  

}
