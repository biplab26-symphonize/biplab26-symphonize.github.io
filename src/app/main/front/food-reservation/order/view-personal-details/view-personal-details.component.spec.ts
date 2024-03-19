import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPersonalDetailsComponent } from './view-personal-details.component';

describe('ViewPersonalDetailsComponent', () => {
  let component: ViewPersonalDetailsComponent;
  let fixture: ComponentFixture<ViewPersonalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPersonalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
