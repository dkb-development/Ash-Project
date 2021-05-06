import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../user_services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class FetchPostsService {
  constructor(private http : HttpClient,private AuthService: AuthService) { }
  ngOnInit(): void {
    
  }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  authHeaders = { headers: new HttpHeaders().set("Authorization", "Bearer " + this.AuthService.getToken()) }
  
  fetch_posts(){
    return this.http.get(environment.apiBaseUrl + 'posts/',this.authHeaders)
  }
  get_posts(){
    return this.http.get('http://localhost:3000/user/posts').pipe(retry(3), catchError(this.handleError));
  }
  create_post(post_data:Post_data){
    return this.http.post<any>('http://localhost:3000/client/create_post',post_data)
  }

  





  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
interface Post_data{
  post_title: string,
  post_description: string
}