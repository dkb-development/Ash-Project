import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMessagingComponent } from './client-messaging.component';

describe('ClientMessagingComponent', () => {
  let component: ClientMessagingComponent;
  let fixture: ComponentFixture<ClientMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientMessagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
