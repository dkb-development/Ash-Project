import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSidebarUserCardComponent } from './chat-sidebar-user-card.component';

describe('ChatSidebarUserCardComponent', () => {
  let component: ChatSidebarUserCardComponent;
  let fixture: ComponentFixture<ChatSidebarUserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatSidebarUserCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSidebarUserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
