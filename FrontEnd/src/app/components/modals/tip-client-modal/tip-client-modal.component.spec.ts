import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipClientModalComponent } from './tip-client-modal.component';

describe('TipClientModalComponent', () => {
  let component: TipClientModalComponent;
  let fixture: ComponentFixture<TipClientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipClientModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
