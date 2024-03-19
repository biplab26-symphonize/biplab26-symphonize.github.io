import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationmsgComponent } from './confirmationmsg.component';

describe('ConfirmationmsgComponent', () => {
  let component: ConfirmationmsgComponent;
  let fixture: ComponentFixture<ConfirmationmsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationmsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
