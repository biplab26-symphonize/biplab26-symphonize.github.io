import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMorePriceComponent } from './add-more-price.component';

describe('AddMorePriceComponent', () => {
  let component: AddMorePriceComponent;
  let fixture: ComponentFixture<AddMorePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMorePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMorePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
