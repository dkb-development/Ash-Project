import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { AuthService } from '../user_services/auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetUserInfoService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  authHeaders = { headers: new HttpHeaders().set("Authorization", "Bearer " + this.AuthService.getToken()) }

  constructor(
    private http: HttpClient,
    private AuthService: AuthService
  ) { }

  getUsers(){
    try {
      // console.log(this.authHeaders);
      return this.http.get(environment.apiBaseUrl + 'client/get_users', this.authHeaders);
      
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }

  restrictUser(user_info: any){
    try {
      return this.http.post(environment.apiBaseUrl + 'client/restrict_user', user_info, this.authHeaders);
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }

  removeRestrictUser(user_info: any){
    try {
      return this.http.post(environment.apiBaseUrl + 'client/remove_restrict_user', user_info, this.authHeaders);
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }

  blockUser(user_info: any){
    try {
      return this.http.post(environment.apiBaseUrl + 'client/block_user', user_info, this.authHeaders);
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }

  unblockUser(user_info: any){
    try {
      return this.http.post(environment.apiBaseUrl + 'client/unblock_user', user_info, this.authHeaders);
    } 
    catch (error) {
      console.log(error);
      return error;
    }
  }
}
