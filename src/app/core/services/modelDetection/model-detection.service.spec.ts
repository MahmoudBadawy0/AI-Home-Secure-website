import { TestBed } from '@angular/core/testing';

import { ModelDetectionService } from './model-detection.service';

describe('ModelDetectionService', () => {
  let service: ModelDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
