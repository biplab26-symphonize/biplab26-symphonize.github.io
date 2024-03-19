import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterdataComponent } from './registerdata.component';

describe('RegisterdataComponent', () => {
  let component: RegisterdataComponent;
  let fixture: ComponentFixture<RegisterdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
