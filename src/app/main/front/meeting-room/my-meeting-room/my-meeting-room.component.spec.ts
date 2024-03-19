import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMeetingRoomComponent } from './my-meeting-room.component';

describe('MyMeetingRoomComponent', () => {
  let component: MyMeetingRoomComponent;
  let fixture: ComponentFixture<MyMeetingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyMeetingRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMeetingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
