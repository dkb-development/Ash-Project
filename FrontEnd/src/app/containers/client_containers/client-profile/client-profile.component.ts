import { Component, OnInit } from '@angular/core';

// Services
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service'

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {

  constructor(
    public CurrentUserStateService: CurrentUserStateService
  ) { }

  ngOnInit(): void {
  }

}
