import { Directive } from '@angular/core';
import { Output, EventEmitter, OnDestroy } from '@angular/core';
@Directive({
  selector: '[IdleDetector]',
})
export class IdleDetectorDirective implements OnDestroy {
  constructor() {}
  ngOnDestroy(): void {}
}
