import { TestBed } from '@angular/core/testing';

import { DiningReservationService } from './dining-reservation.service';

describe('DiningReservationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiningReservationService = TestBed.get(DiningReservationService);
    expect(service).toBeTruthy();
  });
});
