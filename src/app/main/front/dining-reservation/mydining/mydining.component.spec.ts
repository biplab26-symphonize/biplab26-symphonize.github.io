import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MydiningComponent } from './mydining.component';

describe('MydiningComponent', () => {
  let component: MydiningComponent;
  let fixture: ComponentFixture<MydiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MydiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
