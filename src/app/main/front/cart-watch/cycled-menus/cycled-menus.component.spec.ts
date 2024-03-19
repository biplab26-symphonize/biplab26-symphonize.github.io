import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycledMenusComponent } from './cycled-menus.component';

describe('CycledMenusComponent', () => {
  let component: CycledMenusComponent;
  let fixture: ComponentFixture<CycledMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycledMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycledMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
