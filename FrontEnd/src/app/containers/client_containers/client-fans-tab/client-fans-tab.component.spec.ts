import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFansTabComponent } from './client-fans-tab.component';

describe('ClientFansTabComponent', () => {
  let component: ClientFansTabComponent;
  let fixture: ComponentFixture<ClientFansTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientFansTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFansTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
