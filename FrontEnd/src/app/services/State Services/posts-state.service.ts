import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsStateService {
  private readonly _posts_list = new BehaviorSubject<any>([]);
  public posts_list$ = this._posts_list.asObservable();

  constructor() { }

  setPostsList(posts_list: any){
    this._posts_list.next(posts_list);
  }
  updatePost(post_details: any){
    var posts_lists = this._posts_list.getValue();
    for(let post of posts_lists){
      if(post.post_info._id == post_details.post_info._id){
        post.post_info.no_of_likes = post_details.post_info.no_of_likes;
        break;
      }
    }

    this._posts_list.next(posts_lists);
  }
}
