import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewRoomFormComponent } from './new-room-form.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NewRoomFormComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [NewRoomFormComponent],
})
export class NewRoomFormModule {}
