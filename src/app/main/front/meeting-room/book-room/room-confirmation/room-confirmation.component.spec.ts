import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomConfirmationComponent } from './room-confirmation.component';

describe('RoomConfirmationComponent', () => {
  let component: RoomConfirmationComponent;
  let fixture: ComponentFixture<RoomConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
