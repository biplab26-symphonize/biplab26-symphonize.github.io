import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRoomCalendarComponent } from './guest-room-calendar.component';

describe('GuestRoomCalendarComponent', () => {
  let component: GuestRoomCalendarComponent;
  let fixture: ComponentFixture<GuestRoomCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestRoomCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestRoomCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
