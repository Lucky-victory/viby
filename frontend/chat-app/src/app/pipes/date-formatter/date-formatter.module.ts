import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatterPipe } from './date-formatter.pipe';



@NgModule({
  declarations: [DateFormatterPipe],
  imports: [
    CommonModule
  ],
  exports:[DateFormatterPipe]
})
export class DateFormatterModule { }
