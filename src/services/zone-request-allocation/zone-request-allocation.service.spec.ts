import { TestBed } from '@angular/core/testing';

import { ZoneRequestAllocationService } from './zone-request-allocation.service';

describe('ZoneRequestAllocationService', () => {
  let service: ZoneRequestAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneRequestAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
