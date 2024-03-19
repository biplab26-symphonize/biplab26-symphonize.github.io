import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddapprovalComponent } from './addapproval.component';

describe('AddapprovalComponent', () => {
  let component: AddapprovalComponent;
  let fixture: ComponentFixture<AddapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
