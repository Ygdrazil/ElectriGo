import { TestBed } from '@angular/core/testing';

import { RouteCostService } from './route-cost.service';

describe('RouteCostService', () => {
  let service: RouteCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
