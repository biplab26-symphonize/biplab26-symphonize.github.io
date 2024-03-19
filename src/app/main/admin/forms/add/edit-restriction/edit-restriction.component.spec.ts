import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRestrictionComponent } from './edit-restriction.component';

describe('EditRestrictionComponent', () => {
  let component: EditRestrictionComponent;
  let fixture: ComponentFixture<EditRestrictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRestrictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
