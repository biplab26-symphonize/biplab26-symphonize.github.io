import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPagesComponent } from './confirm-pages.component';

describe('ConfirmPagesComponent', () => {
  let component: ConfirmPagesComponent;
  let fixture: ComponentFixture<ConfirmPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
