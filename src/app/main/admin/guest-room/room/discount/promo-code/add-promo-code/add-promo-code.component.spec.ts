import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPromoCodeComponent } from './add-promo-code.component';

describe('AddPromoCodeComponent', () => {
  let component: AddPromoCodeComponent;
  let fixture: ComponentFixture<AddPromoCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPromoCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPromoCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
