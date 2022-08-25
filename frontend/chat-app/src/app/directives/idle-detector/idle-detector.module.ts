import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdleDetectorDirective } from './idle-detector.directive';



@NgModule({
  declarations: [
    IdleDetectorDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[IdleDetectorDirective]
})
export class IdleDetectorModule { }
