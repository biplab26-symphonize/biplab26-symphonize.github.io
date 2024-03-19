import { TestBed } from '@angular/core/testing';

import { RotatingMenuService } from './rotating-menu.service';

describe('RotatingMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RotatingMenuService = TestBed.get(RotatingMenuService);
    expect(service).toBeTruthy();
  });
});
