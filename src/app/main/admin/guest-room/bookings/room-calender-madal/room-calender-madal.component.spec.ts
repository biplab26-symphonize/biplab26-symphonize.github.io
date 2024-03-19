import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCalenderMadalComponent } from './room-calender-madal.component';

describe('RoomCalenderMadalComponent', () => {
  let component: RoomCalenderMadalComponent;
  let fixture: ComponentFixture<RoomCalenderMadalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomCalenderMadalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomCalenderMadalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
