import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningGuestsComponent } from './dining-guests.component';

describe('DiningGuestsComponent', () => {
  let component: DiningGuestsComponent;
  let fixture: ComponentFixture<DiningGuestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiningGuestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
