import { TestBed } from '@angular/core/testing';

import { PackageOptionService } from './package-option.service';

describe('PackageOptionService', () => {
  let service: PackageOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
