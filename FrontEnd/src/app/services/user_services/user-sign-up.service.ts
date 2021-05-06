import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserSignUpService {

  _url = "http://localhost:3000";
  constructor(private _http:HttpClient) { }

  signUp(user:User){
    return this._http.post<any>(this._url,user);
  }
}
