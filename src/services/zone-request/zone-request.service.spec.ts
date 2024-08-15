import { TestBed } from '@angular/core/testing';

import { ZoneRequestService } from './zone-request.service';

describe('ZoneRequestService', () => {
  let service: ZoneRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
