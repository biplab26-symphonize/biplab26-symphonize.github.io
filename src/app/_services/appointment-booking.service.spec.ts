import { TestBed } from '@angular/core/testing';

import { AppointmentBookingService } from './appointment-booking.service';

describe('AppointmentBookingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppointmentBookingService = TestBed.get(AppointmentBookingService);
    expect(service).toBeTruthy();
  });
});
