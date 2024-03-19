import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTimesComponent } from './working-times.component';

describe('WorkingTimesComponent', () => {
  let component: WorkingTimesComponent;
  let fixture: ComponentFixture<WorkingTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
