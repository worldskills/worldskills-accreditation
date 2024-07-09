import { TestBed } from '@angular/core/testing';

import { ZoneRequestFormEmailService } from './zone-request-form-email.service';

describe('ZoneRequestFormEmailService', () => {
  let service: ZoneRequestFormEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneRequestFormEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
