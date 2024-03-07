import { TestBed } from '@angular/core/testing';

import { ZoneRequestFormService } from './zone-request-form.service';

describe('ZoneRequestFormService', () => {
  let service: ZoneRequestFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneRequestFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
