import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownifyPipe } from './markdownify.pipe';



@NgModule({
  declarations: [
    MarkdownifyPipe
  ],
  imports: [
    CommonModule
  ],exports:[MarkdownifyPipe]
})
export class MarkdownifyModule { }
