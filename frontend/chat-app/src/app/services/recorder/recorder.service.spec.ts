import { TestBed } from '@angular/core/testing';

import { AudioRecorderService } from './recorder.service';

describe('AuthService', () => {
  let service: AudioRecorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioRecorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});