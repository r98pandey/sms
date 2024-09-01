import { TestBed } from '@angular/core/testing';

import { WorkForceService } from './work-force.service';

describe('WorkForceService', () => {
  let service: WorkForceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkForceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
