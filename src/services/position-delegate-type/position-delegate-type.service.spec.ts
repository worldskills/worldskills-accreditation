import { TestBed } from '@angular/core/testing';

import { PositionDelegateTypeService } from './position-delegate-type.service';

describe('PositionDelegateTypeService', () => {
  let service: PositionDelegateTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositionDelegateTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
