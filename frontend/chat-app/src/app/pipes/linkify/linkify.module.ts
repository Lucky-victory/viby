import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkifyPipe } from './linkify.pipe';

@NgModule({
  declarations: [LinkifyPipe],
  imports: [CommonModule],
  exports: [LinkifyPipe],
})
export class LinkifyModule {}
