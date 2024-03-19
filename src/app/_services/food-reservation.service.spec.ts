import { TestBed } from '@angular/core/testing';

import { FoodReservationService } from './food-reservation.service';

describe('FoodReservationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoodReservationService = TestBed.get(FoodReservationService);
    expect(service).toBeTruthy();
  });
});
