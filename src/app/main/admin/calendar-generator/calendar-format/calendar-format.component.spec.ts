import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarFormatComponent } from './calendar-format.component';

describe('CalendarFormatComponent', () => {
  let component: CalendarFormatComponent;
  let fixture: ComponentFixture<CalendarFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
