import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPromoCodeComponent } from './list-promo-code.component';

describe('ListPromoCodeComponent', () => {
  let component: ListPromoCodeComponent;
  let fixture: ComponentFixture<ListPromoCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPromoCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPromoCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
