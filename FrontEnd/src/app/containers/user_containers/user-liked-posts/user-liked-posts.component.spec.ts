import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLikedPostsComponent } from './user-liked-posts.component';

describe('UserLikedPostsComponent', () => {
  let component: UserLikedPostsComponent;
  let fixture: ComponentFixture<UserLikedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLikedPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLikedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
