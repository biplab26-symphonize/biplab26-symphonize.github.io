import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditentryComponent } from './editentry.component';

describe('EditentryComponent', () => {
  let component: EditentryComponent;
  let fixture: ComponentFixture<EditentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
