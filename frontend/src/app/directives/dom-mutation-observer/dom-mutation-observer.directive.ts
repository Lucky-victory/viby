import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
/**
 * Emits an event when DOM changes is observed
 */
@Directive({
  selector: '[domMutationObserver]',
})
export class DomMutationObserverDirective implements AfterViewInit, OnDestroy {
  /**
   * Emitted when DOM changes is observed
   */
  @Output() onMutationObserve = new EventEmitter<any>();
  /**
   * browser API to detect when a new element is added to the DOM
   */
  private mutationObserver!: MutationObserver;
  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      this.onMutationObserve.emit(this.elementRef.nativeElement);
    });
    this.mutationObserver.observe(this.elementRef.nativeElement, {
      childList: true,
    });
  }

  ngOnDestroy(): void {
    this.mutationObserver.disconnect();
  }
}
