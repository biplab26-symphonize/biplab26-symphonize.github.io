import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSidedishComponent } from './add-sidedish.component';

describe('AddSidedishComponent', () => {
  let component: AddSidedishComponent;
  let fixture: ComponentFixture<AddSidedishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSidedishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSidedishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
