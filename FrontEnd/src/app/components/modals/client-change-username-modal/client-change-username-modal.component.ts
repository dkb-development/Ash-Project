import { Component, OnInit } from '@angular/core';

// Services
import {  CurrentUserStateService } from '../../../services/State Services/current-user-state.service';
import { AuthService } from '../../../services/user_services/auth.service';

@Component({
  selector: 'app-client-change-username-modal',
  templateUrl: './client-change-username-modal.component.html',
  styleUrls: ['./client-change-username-modal.component.css']
})
export class ClientChangeUsernameModalComponent implements OnInit {

  constructor(
    public CurrentUserStateService: CurrentUserStateService,
    private AuthService : AuthService
  ) { }

  ngOnInit(): void {
  }
  update_username_spinner = false;
  server_error: any = null;
  changeUsername(new_username: any){
    this.update_username_spinner = true;
    this.AuthService.changeUsername(new_username).subscribe(
      (res: any)=>{
        this.CurrentUserStateService.updateCurrentUser(res);
        $('#clientChangeUsernameModal').modal('hide');
        this.update_username_spinner = false;
        this.server_error = null;
      },
      (error: any)=>{
        this.update_username_spinner = false;
        this.server_error = error.error.err;
        console.log(error);
      }
    )
  }

}
