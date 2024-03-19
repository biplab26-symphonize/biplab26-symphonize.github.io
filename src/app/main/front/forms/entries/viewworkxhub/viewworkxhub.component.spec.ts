import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewworkxhubComponent } from './viewworkxhub.component';

describe('ViewworkxhubComponent', () => {
  let component: ViewworkxhubComponent;
  let fixture: ComponentFixture<ViewworkxhubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewworkxhubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewworkxhubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
