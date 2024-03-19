import { TestBed } from '@angular/core/testing';

import { SideDishService } from './side-dish.service';

describe('SideDishService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SideDishService = TestBed.get(SideDishService);
    expect(service).toBeTruthy();
  });
});
