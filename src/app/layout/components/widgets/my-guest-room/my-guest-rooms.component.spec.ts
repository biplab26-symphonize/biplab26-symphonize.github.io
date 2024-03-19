import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGuestRoomsComponent } from './my-guest-rooms.component';

describe('MyGuestRoomComponent', () => {
  let component: MyGuestRoomsComponent;
  let fixture: ComponentFixture<MyGuestRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyGuestRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGuestRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
