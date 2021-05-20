import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserPostService {

  constructor(private http : HttpClient,private AuthService: AuthService) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  authHeaders = { headers: new HttpHeaders().set("Authorization", "Bearer " + this.AuthService.getToken()) }


  // Like/Dislike Services
  like_or_dislike_post(like_or_dislike_post_details: any){
    // console.log(like_or_dislike_post_details);
    return this.http.post<any>(environment.apiBaseUrl + 'like_or_dislike_post',like_or_dislike_post_details,this.authHeaders);
  }


  // Payment Services
  pay_to_unlock(post_to_unlock_details:any){
    // console.log(post_to_unlock_details.user_id);
    return this.http.post<any>(environment.apiBaseUrl + 'pay_to_unlock', post_to_unlock_details,this.authHeaders);
  }

  pay_tip_to_post(post_to_unlock_details:any){
    // console.log(post_to_unlock_details.user_id);
    return this.http.post<any>(environment.apiBaseUrl + 'pay_tip_to_post', post_to_unlock_details,this.authHeaders);
  }
}
