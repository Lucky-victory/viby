import { NewChannelFormComponent } from './new-channel-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [NewChannelFormComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [NewChannelFormComponent],
})
export class NewChannelFormModule {}
