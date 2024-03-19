import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewestStaffComponent } from './newest-staff.component';

describe('NewestStaffComponent', () => {
  let component: NewestStaffComponent;
  let fixture: ComponentFixture<NewestStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewestStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewestStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
