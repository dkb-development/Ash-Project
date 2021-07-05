import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditPostComponent } from './client-edit-post.component';

describe('ClientEditPostComponent', () => {
  let component: ClientEditPostComponent;
  let fixture: ComponentFixture<ClientEditPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientEditPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
