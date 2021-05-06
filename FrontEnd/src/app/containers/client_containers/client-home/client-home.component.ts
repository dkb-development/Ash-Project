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
  ngOnInit(): void {
    this.FetchPostsService.fetch_posts().subscribe(
      (res:any)=>{
        res.forEach((post:any)=>{
          post.media = post.media.split('?')[0];
          this.posts.push(post);
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
