import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBookingsDetailsComponent } from './display-bookings-details.component';

describe('DisplayBookingsDetailsComponent', () => {
  let component: DisplayBookingsDetailsComponent;
  let fixture: ComponentFixture<DisplayBookingsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayBookingsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayBookingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
