import { TestBed } from '@angular/core/testing';

import { GetUserProfilePicService } from './get-user-profile-pic.service';

describe('GetUserProfilePicService', () => {
  let service: GetUserProfilePicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUserProfilePicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
