import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User = new User();
  constructor(private http: HttpClient) { }

  setUser(){
    if(this.getToken()){
      this.user._id = "123";
      this.user.username = "adfd";
      console.log(this.user);
    }
    else{
      this.user = null;
    }
    
  }
  getUser(){
    return this.getUserPayload();
  }
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  authHeaders = { headers: new HttpHeaders().set("Authorization", "Bearer " + this.getToken()) }

//   const headers: { [name: string]: string } = {
//     Accept: 'application/json',
// }
  
  signUp(user: any){
    return this.http.post(environment.apiBaseUrl+'user/signup',user,this.noAuthHeader);
  }

  login(authCredentials: any) {
    // localhost:3000/user/login
    
    try {
      var res = this.http.post(environment.apiBaseUrl + 'user/login', authCredentials,this.noAuthHeader);
      return res;
    } 
    catch (error) {
      return error;
    }
    
  }

  logout(){
    this.deleteToken();
  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + 'user/userProfile',this.authHeaders);
  }

  
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    var token = localStorage.getItem('token');
    if(token){
      return token;
    }
    else{
      return null;
    }
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  
  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  get_username(){
    var token = this.getToken();
    if (token) {
      var username = this.getUserPayload()['username'];
      // var user_id = atob(token.split('.')[1]);
      // var res = this.http.post(environment.apiBaseUrl + 'userProfile', user_id,this.authHeaders);
      return username;
      
    }
    else
      return null;
  }
  // static isLoggedIn(): boolean {
  //   throw new Error('Method not implemented.');
  // }
  isLoggedIn() : boolean{
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
}
interface Response {
  [key: string]: any;
  
}
class User{
  _id: string;
  username: string;
}