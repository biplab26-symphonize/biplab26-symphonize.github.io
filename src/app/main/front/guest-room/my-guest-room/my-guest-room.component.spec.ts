import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGuestRoomComponent } from './my-guest-room.component';

describe('MyGuestRoomComponent', () => {
  let component: MyGuestRoomComponent;
  let fixture: ComponentFixture<MyGuestRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyGuestRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGuestRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
