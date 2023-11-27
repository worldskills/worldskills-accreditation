import { TestBed } from '@angular/core/testing';

import { BadgeTemplateService } from './badge-template.service';

describe('BadgeTemplateService', () => {
  let service: BadgeTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BadgeTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
