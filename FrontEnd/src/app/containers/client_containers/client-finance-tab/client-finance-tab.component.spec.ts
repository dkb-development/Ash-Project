import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFinanceTabComponent } from './client-finance-tab.component';

describe('ClientFinanceTabComponent', () => {
  let component: ClientFinanceTabComponent;
  let fixture: ComponentFixture<ClientFinanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientFinanceTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFinanceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
