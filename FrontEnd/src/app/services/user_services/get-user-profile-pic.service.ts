import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GetUserProfilePicService {

  constructor(
    private AuthService: AuthService
  ) { }

  getProfilePicUrlFromUsername(username: any){
    return "https://avatars.dicebear.com/api/human/"+username+".svg"; 
  }
  getProfilePicUrl(id: any){
    this.AuthService.getUserFromId(id).subscribe(
      (user: any)=>{
        return "https://avatars.dicebear.com/api/human/"+user.username+".svg";
      },
      (err: any)=>{
        console.log(err);
        return err;
      }
    )
  }
}
