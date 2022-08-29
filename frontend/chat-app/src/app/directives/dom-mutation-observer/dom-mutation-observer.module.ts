import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomMutationObserverDirective } from './dom-mutation-observer.directive';

@NgModule({
  declarations: [DomMutationObserverDirective],
  imports: [CommonModule],
  exports: [DomMutationObserverDirective],
})
export class DomMutationObserverModule {}
