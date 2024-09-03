import { TestBed } from '@angular/core/testing';

import { RegistrationsService } from './registrations.service';

describe('RegistrationsService', () => {
  let service: RegistrationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
