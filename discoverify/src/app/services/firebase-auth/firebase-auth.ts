import { TestBed } from '@angular/core/testing';

import { FirebaseLoginService } from './firebase-auth.service';

describe('FirebaseLogService', () => {
  let service: FirebaseLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
