import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsStateService {
  private readonly _posts_list = new BehaviorSubject<any>([]);
  public posts_list$ = this._posts_list.asObservable();

  private readonly _posts_to_be_deleted = new BehaviorSubject<any>([]);
  public posts_to_be_deleted$ = this._posts_to_be_deleted.asObservable();

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

  setPostToBeDeleted(post_id: any){
    this._posts_to_be_deleted.next(post_id);
  }
  resetPostToBeDeleted(){
    this._posts_to_be_deleted.next(null);
  }
  getPostToBeDeleted(){
    return this._posts_to_be_deleted.getValue();
  }
}
