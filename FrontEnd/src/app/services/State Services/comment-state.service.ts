import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentStateService {
  private readonly _comments_for_post = new BehaviorSubject<any>([]);
  public comments_for_post$ = this._comments_for_post.asObservable();

  private readonly _current_comments_for_post = new BehaviorSubject<any>([]);
  public current_comments_for_post$ = this._current_comments_for_post.asObservable();
  
  constructor() { }
  // getCommentsForPost(post_id: any){
  //   return this._comments_for_post.getValue().filter((comment: any)=>{
  //     comment.post_id == post_id
  //   })
  // }
  // setCommentsForPost(commentsForPost: any){
  //   this._current_comments_for_post.next(commentsForPost);
  // }
  getSingleCommentForPost(comment_id: any,post_id: any){
    for(let comment of this._comments_for_post.getValue()){
      if(comment.post_id==post_id && comment.comment_id==comment_id){
        console.log(comment);
        return comment;
      }
    }
    
  }

  updateSingleCommentForPost(commentForPost: any){
    var prev_comments_for_post = this._comments_for_post.getValue();
    var new_comments_for_post = [];
    var prev_comment_found = false;
    for(let comment of prev_comments_for_post){
      if(comment.post_id == commentForPost.post_id && comment.comment_id==commentForPost.comment_id){
        comment = commentForPost;
        prev_comment_found = true;
      }
      new_comments_for_post.push(comment);
    }
    if(!prev_comment_found){
      new_comments_for_post.push(commentForPost)
    }
    this._comments_for_post.next(new_comments_for_post);
  }

  updateCommentsForPost(commentsForPost: any){
    console.log(this._comments_for_post.getValue());


    var prev_comments_for_post = this._comments_for_post.getValue();
    console.log(prev_comments_for_post);

    for(let comment of commentsForPost){
      console.log(comment)
      var present = false;
      for(let prev_comment of prev_comments_for_post){
        if(prev_comment.comment_id == comment.comment_id){
          present = true;
          break;
        }
      }
      if(!present){
        prev_comments_for_post.push(comment)

      } 
    }
    this._comments_for_post.next(prev_comments_for_post);
    
  }
}
