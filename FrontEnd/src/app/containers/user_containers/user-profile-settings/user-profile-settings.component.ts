import { Component, OnInit } from '@angular/core';

// Services
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service';


@Component({
  selector: 'app-user-profile-settings',
  templateUrl: './user-profile-settings.component.html',
  styleUrls: ['./user-profile-settings.component.css']
})
export class UserProfileSettingsComponent implements OnInit {

  constructor(
    public CurrentUserStateService: CurrentUserStateService

  ) { }

  ngOnInit(): void {
  }

}
