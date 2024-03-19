import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsettingComponent } from './approvalsetting.component';

describe('ApprovalsettingComponent', () => {
  let component: ApprovalsettingComponent;
  let fixture: ComponentFixture<ApprovalsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
