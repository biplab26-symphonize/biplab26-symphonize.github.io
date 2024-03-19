import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysEventComponent } from './todays-event.component';

describe('TodaysEventComponent', () => {
  let component: TodaysEventComponent;
  let fixture: ComponentFixture<TodaysEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodaysEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
