import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCustomizationComponent } from './calendar-customization.component';

describe('CalendarCustomizationComponent', () => {
  let component: CalendarCustomizationComponent;
  let fixture: ComponentFixture<CalendarCustomizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarCustomizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
