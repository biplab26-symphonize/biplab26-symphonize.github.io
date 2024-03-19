import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAccountDetailsComponent } from './plan-account-details.component';

describe('PlanAccountDetailsComponent', () => {
  let component: PlanAccountDetailsComponent;
  let fixture: ComponentFixture<PlanAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanAccountDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
