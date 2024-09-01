import { TestBed } from '@angular/core/testing';

import { ClientDashbaordService } from './client-dashbaord.service';

describe('ClientDashbaordService', () => {
  let service: ClientDashbaordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientDashbaordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
