import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Services
import { AuthService } from '../user_services/auth.service';
import { CurrentUserStateService } from '../State Services/current-user-state.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private http: HttpClient,
    private AuthService: AuthService,
    private CurrentUserStateService: CurrentUserStateService
  ) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  authHeaders = { headers: new HttpHeaders().set("Authorization", "Bearer " + this.AuthService.getToken()) }

  makeComment(comment_info: any){
    var comment = {
      ...comment_info,
      "user_id": this.CurrentUserStateService.getCurrentUser()._id
    }
    return this.http.post(environment.apiBaseUrl + 'comment/make_comment',comment,this.authHeaders)
  }

  getCommnetsForPost(post_info: any){
    var comment = {
      "post_id": post_info._id,
      "user_id": this.CurrentUserStateService.getCurrentUser()._id
    }
    return this.http.post(environment.apiBaseUrl + 'comment/get_comments_for_post',comment,this.authHeaders)
  }

  likeCommentForPost(comment_id: any){
    var comment = {
      "comment_id": comment_id,
      "user_id": this.CurrentUserStateService.getCurrentUser()._id
    }
    return this.http.post(environment.apiBaseUrl + 'comment/like_dislike_comment',comment,this.authHeaders)
  }

  deleteComment(comment_id: any){
    var comment = {
      "comment_id": comment_id,
      "user_id": this.CurrentUserStateService.getCurrentUser()._id
    }
    return this.http.post(environment.apiBaseUrl + 'comment/delete_comment',comment,this.authHeaders)
  }
}
