import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserStateService {
  private readonly _current_user = new BehaviorSubject<any>([]);
  public current_user$ = this._current_user.asObservable();
  constructor() { }

  setCurrentUser(user_details: any){
    if(user_details.profile_picture){
      user_details.profile_picture = user_details.profile_picture.split('?')[0];
    }
    this._current_user.next(user_details);
  }
  getCurrentUser(){
    return this._current_user.getValue();
  }
  updateCurrentUser(new_user_info: any){
    if(new_user_info.profile_picture){
      new_user_info.profile_picture = new_user_info.profile_picture.split('?')[0];
    }
    this._current_user.next(new_user_info);
  }
}
