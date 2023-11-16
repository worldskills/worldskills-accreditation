import { TestBed } from '@angular/core/testing';

import { DelegateTypeService } from './delegate-type.service';

describe('DelegateTypeService', () => {
  let service: DelegateTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelegateTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
