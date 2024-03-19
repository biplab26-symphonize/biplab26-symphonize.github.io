import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeAccountDetailsComponent } from './charge-account-details.component';

describe('ChargeAccountDetailsComponent', () => {
  let component: ChargeAccountDetailsComponent;
  let fixture: ComponentFixture<ChargeAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeAccountDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
