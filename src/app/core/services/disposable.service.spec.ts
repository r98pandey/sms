import { TestBed } from '@angular/core/testing';

import { DisposableService } from './disposable.service';

describe('DisposableService', () => {
  let service: DisposableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisposableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
