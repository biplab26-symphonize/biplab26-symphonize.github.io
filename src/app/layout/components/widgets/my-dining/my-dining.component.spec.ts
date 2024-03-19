import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDiningComponent } from './my-dining.component';

describe('MyDiningComponent', () => {
  let component: MyDiningComponent;
  let fixture: ComponentFixture<MyDiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
