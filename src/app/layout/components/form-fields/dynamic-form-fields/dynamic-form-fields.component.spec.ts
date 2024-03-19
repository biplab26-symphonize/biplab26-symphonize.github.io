import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormFieldsComponent } from './dynamic-form-fields.component';

describe('DynamicFormFieldsComponent', () => {
  let component: DynamicFormFieldsComponent;
  let fixture: ComponentFixture<DynamicFormFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
