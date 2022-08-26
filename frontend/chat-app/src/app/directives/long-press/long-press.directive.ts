import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Gesture, GestureController, Platform } from '@ionic/angular';

@Directive({
  selector: '[longPress]',
})
export class LongPressDirective implements AfterViewInit, OnDestroy {
  // how much a pointer must move before the gesture starts.
  @Input() panInterval: number = 0;

  //  hold time before emitting press end event
  @Input() pressInterval: number = 800;
  // the event to call when the element gets long pressed
  @Output() pressed: EventEmitter<any> = new EventEmitter<any>();
  // whether to allow long press only on touchable devices
  @Input() mobileOnly: boolean = true;

  //to be used to clear the setTimeout
  private timeoutID!: any;
  private isDesktop!: boolean;
  private gesture!: Gesture;
  private longPressActive: boolean = false;
  constructor(
    private gestureCtrl: GestureController,
    private element: ElementRef,
    private platform: Platform
  ) {
    this.isDesktop = platform.is('desktop');
  }
  ngAfterViewInit(): void {
    if (this.mobileOnly && !this.isDesktop) {
      this.generateGesture();
    } else if (!this.mobileOnly) {
      this.generateGesture();
    }
  }
  private onPressEnd(): void {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
  }

  private onPressStart(): void {
    this.timeoutID = setTimeout(() => {
      if (this.longPressActive) {
        //emit pressed event with the element that triggered it
        this.pressed.emit(this.element.nativeElement);
      }
    }, this.pressInterval);
  }
  /**
   * Generates an ionic gesture
   */
  private generateGesture(): void {
    // the element to attach the long press event
    const elem = this.element.nativeElement;
    this.gesture = this.gestureCtrl.create(
      {
        el: elem,
        gestureName: 'long-press',
        threshold: this.panInterval,
        onStart: () => {
          this.longPressActive = true;
          this.onPressStart();
        },
        onEnd: () => {
          this.longPressActive = false;
          this.onPressEnd();
        },
      },
      true
    );
    this.gesture.enable(true);
  }
  ngOnDestroy(): void {
    // destroy the gesture when the component gets destroyed
    if (this.gesture) {
      this.gesture.destroy();
    }
  }
}
