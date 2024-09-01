import { TestBed } from '@angular/core/testing';

import { PreventiveService } from './preventive.service';

describe('PreventiveService', () => {
  let service: PreventiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreventiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
