import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientChangeUsernameModalComponent } from './client-change-username-modal.component';

describe('ClientChangeUsernameModalComponent', () => {
  let component: ClientChangeUsernameModalComponent;
  let fixture: ComponentFixture<ClientChangeUsernameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientChangeUsernameModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientChangeUsernameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
