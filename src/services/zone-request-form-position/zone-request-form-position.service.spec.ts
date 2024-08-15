import { TestBed } from '@angular/core/testing';

import { ZoneRequestFormPositionService } from './zone-request-form-position.service';

describe('ZoneRequestFormPositionService', () => {
  let service: ZoneRequestFormPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneRequestFormPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
