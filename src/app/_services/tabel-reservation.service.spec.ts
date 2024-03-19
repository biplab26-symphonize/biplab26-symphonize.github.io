import { TestBed } from '@angular/core/testing';

import { TabelReservationService } from './tabel-reservation.service';

describe('TabelReservationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabelReservationService = TestBed.get(TabelReservationService);
    expect(service).toBeTruthy();
  });
});
