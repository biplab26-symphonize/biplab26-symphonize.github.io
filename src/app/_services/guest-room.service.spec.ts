import { TestBed } from '@angular/core/testing';

import { GuestRoomService } from './guest-room.service';

describe('GuestRoomService', () => {
  let service: GuestRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuestRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
