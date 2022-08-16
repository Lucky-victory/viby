import { Injectable } from '@angular/core';
import { ActionSheetController, ActionSheetOptions, ModalController, ModalOptions, Platform, PopoverController, PopoverOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private popoverCtrl:PopoverController,private modalCtrl:ModalController,private toastCtrl:ToastController,private actionSheetCtrl:ActionSheetController,private platform:Platform) { }

  async showActionSheet(options:ActionSheetOptions) {
    await this.actionSheetCtrl.create(options);
  }
  async showPopover(options:PopoverOptions) {
    await this.popoverCtrl.create(options);
  }
 async showPopoverOrActionSheet(options: PopoverOptions | ActionSheetOptions) {
    if(this.platform.is('desktop')){
      await this.showPopover(options as PopoverOptions)
    }
    else{
      await this.showActionSheet(options as ActionSheetOptions)
    }
  }
  async showToast(options:ToastOptions) {
    await this.toastCtrl.create(options);
  }
  async showModal(options: ModalOptions) {
    await this.modalCtrl.create(options);
  }
}
