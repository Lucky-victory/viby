import { TestBed } from '@angular/core/testing';

import { ChatRoomGuard } from './chat-room.guard';

describe('ChatRoomGuard', () => {
  let guard: ChatRoomGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChatRoomGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
