import { TestBed } from '@angular/core/testing';

import { PostSmtpService } from './post-smtp.service';

describe('PostSmtpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostSmtpService = TestBed.get(PostSmtpService);
    expect(service).toBeTruthy();
  });
});
