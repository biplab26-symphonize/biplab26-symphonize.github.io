import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdiningComponent } from './viewdining.component';

describe('ViewdiningComponent', () => {
  let component: ViewdiningComponent;
  let fixture: ComponentFixture<ViewdiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewdiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewdiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
