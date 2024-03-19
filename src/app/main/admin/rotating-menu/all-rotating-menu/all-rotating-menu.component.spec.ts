import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRotatingMenuComponent } from './all-rotating-menu.component';

describe('AllRotatingMenuComponent', () => {
  let component: AllRotatingMenuComponent;
  let fixture: ComponentFixture<AllRotatingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRotatingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRotatingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
