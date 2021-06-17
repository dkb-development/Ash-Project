import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import {AuthService} from '../user_services/auth.service';

import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UpdatePostService {

  constructor(
    private http: HttpClient,
    private AuthService: AuthService
  ) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  authHeaders = { headers: new HttpHeaders().set("Authorization", "Bearer " + this.AuthService.getToken()) }

  delete_post(post_id: any){
    console.log(post_id);
    return this.http.post(environment.apiBaseUrl + 'client/delete_post', {"post_id": post_id},this.authHeaders)
  }
}
