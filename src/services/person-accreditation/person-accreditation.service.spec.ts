import { TestBed } from '@angular/core/testing';

import { PersonAccreditationService } from './person-accreditation.service';

describe('PersonAccreditationService', () => {
  let service: PersonAccreditationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonAccreditationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
