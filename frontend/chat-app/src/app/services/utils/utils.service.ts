import { Injectable } from '@angular/core';
import { ActionSheetController, ActionSheetOptions, ModalController, ModalOptions, Platform, PopoverController, PopoverOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private popoverCtrl:PopoverController,private modalCtrl:ModalController,private toastCtrl:ToastController,private actionSheetCtrl:ActionSheetController,private platform:Platform) { }

  async showActionSheet(options?: ActionSheetOptions) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash-outline',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Edit',
        icon: 'create-outline',
        data: 10,
        handler: () => {
          console.log('Share clicked');
        }
      
      }, {
        text: 'Copy Text',
        icon: 'copy-outline',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    return {role,data}
  }
  async showPopover(options:PopoverOptions) {
    await this.popoverCtrl.create(options)
  }
 async showPopoverOrActionSheet(options: PopoverOptions | ActionSheetOptions) {
    if(this.platform.is('desktop')){
      await this.showPopover(options as PopoverOptions)
    }
    else{
      await this.showActionSheet(options as ActionSheetOptions)
    }
  }
  async showToast(options?: ToastOptions) {
    const defaultOpts = {
      duration: 5000,
      position: "top",
      
      buttons: [
        {
          text:'Ok',
          role:'cancel'
        }
      ]
    }
    const opt=Object.assign({},options,defaultOpts)
  
    const toast = await this.toastCtrl.create(opt);
    await toast.present();
    const { role } = await toast.onDidDismiss();
    return role;
  }
  async showModal(options: ModalOptions) {
    await this.modalCtrl.create(options);
  }
}
