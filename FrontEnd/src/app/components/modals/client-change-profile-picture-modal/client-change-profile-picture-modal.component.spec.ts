import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientChangeProfilePictureModalComponent } from './client-change-profile-picture-modal.component';

describe('ClientChangeProfilePictureModalComponent', () => {
  let component: ClientChangeProfilePictureModalComponent;
  let fixture: ComponentFixture<ClientChangeProfilePictureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientChangeProfilePictureModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientChangeProfilePictureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
