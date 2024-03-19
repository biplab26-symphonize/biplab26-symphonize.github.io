import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRotatingMenuComponent } from './view-rotating-menu.component';

describe('ViewRotatingMenuComponent', () => {
  let component: ViewRotatingMenuComponent;
  let fixture: ComponentFixture<ViewRotatingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRotatingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRotatingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
