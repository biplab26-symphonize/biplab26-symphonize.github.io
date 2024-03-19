import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollAnnouncementComponent } from './scroll-announcement.component';

describe('ScrollAnnouncementComponent', () => {
  let component: ScrollAnnouncementComponent;
  let fixture: ComponentFixture<ScrollAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
