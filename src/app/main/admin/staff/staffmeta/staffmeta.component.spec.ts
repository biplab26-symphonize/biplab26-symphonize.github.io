import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffmetaComponent } from './staffmeta.component';

describe('StaffmetaComponent', () => {
  let component: StaffmetaComponent;
  let fixture: ComponentFixture<StaffmetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffmetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffmetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
