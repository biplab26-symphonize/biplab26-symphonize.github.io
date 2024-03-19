import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnavailableComponent } from './add-unavailable.component';

describe('AddUnavailableComponent', () => {
  let component: AddUnavailableComponent;
  let fixture: ComponentFixture<AddUnavailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUnavailableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
