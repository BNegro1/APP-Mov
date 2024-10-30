import { TestBed } from '@angular/core/testing';

import { FirebaseLogService } from './firebase-log.service';

describe('FirebaseLogService', () => {
  let service: FirebaseLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
