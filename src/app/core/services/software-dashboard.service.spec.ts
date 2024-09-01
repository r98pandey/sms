import { TestBed } from '@angular/core/testing';

import { SoftwareDashboardService } from './software-dashboard.service';

describe('SoftwareDashboardService', () => {
  let service: SoftwareDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoftwareDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
