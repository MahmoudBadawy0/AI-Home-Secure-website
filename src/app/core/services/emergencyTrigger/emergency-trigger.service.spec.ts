import { TestBed } from '@angular/core/testing';

import { EmergencyTriggerService } from './emergency-trigger.service';

describe('EmergencyTriggerService', () => {
  let service: EmergencyTriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyTriggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
