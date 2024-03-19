import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonalPricesComponent } from './seasonal-prices.component';

describe('SeasonalPricesComponent', () => {
  let component: SeasonalPricesComponent;
  let fixture: ComponentFixture<SeasonalPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonalPricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonalPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
