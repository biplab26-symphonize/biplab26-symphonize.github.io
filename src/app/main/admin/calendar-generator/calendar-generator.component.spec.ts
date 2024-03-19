import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarGeneratorComponent } from './calendar-generator.component';


describe('CalendarGeneratorComponent', () => {
  let component: CalendarGeneratorComponent;
  let fixture: ComponentFixture<CalendarGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
