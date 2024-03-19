import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAnnouncementComponent } from './event-announcement.component';

describe('EventAnnouncementComponent', () => {
  let component: EventAnnouncementComponent;
  let fixture: ComponentFixture<EventAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
