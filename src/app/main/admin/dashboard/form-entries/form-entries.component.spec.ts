import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEntriesComponent } from './form-entries.component';

describe('FormEntriesComponent', () => {
  let component: FormEntriesComponent;
  let fixture: ComponentFixture<FormEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
