import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningAnnouncementComponent } from './dining-announcement.component';

describe('DiningAnnouncementComponent', () => {
  let component: DiningAnnouncementComponent;
  let fixture: ComponentFixture<DiningAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiningAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
