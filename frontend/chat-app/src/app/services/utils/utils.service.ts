import { Injectable } from '@angular/core';
import {
  ActionSheetController,
  ActionSheetOptions,
  AlertController,
  AlertOptions,
  LoadingController,
  LoadingOptions,
  ModalController,
  ModalOptions,
  Platform,
  PopoverController,
  PopoverOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {}

  async showActionSheet(options?: ActionSheetOptions) {
    const actionSheet = await this.actionSheetCtrl.create({
      ...options,
    });
    await actionSheet.present();

    const { data } = await actionSheet.onDidDismiss();
    return { data };
  }
  async showLoader(options: LoadingOptions) {
    const loader = await this.loadingCtrl.create(options);
    await loader.present();

    await loader.onDidDismiss();
  }
  async showAlert(options: AlertOptions) {
    const alertCtrl = await this.alertController.create({
      ...options,
    });
    await alertCtrl.present();

    const { role } = await alertCtrl.onDidDismiss();
    return { role };
  }
  async showPopover(options: PopoverOptions) {
    const popover = await this.popoverCtrl.create(options);
    await popover.present();
    const { data } = await popover.onDidDismiss();
    return { data };
  }
  async showPopoverOrActionSheet(options: PopoverOptions | ActionSheetOptions) {
    if (this.platform.is('desktop')) {
      return await this.showPopover(options as PopoverOptions);
    } else {
      return await this.showActionSheet(options as ActionSheetOptions);
    }
  }
  async showToast(options?: ToastOptions) {
    const defaultOpts = {
      duration: 3000,
      position: 'top',
      mode: 'ios',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
    };
    const opt = Object.assign({}, defaultOpts, options);

    const toast = await this.toastCtrl.create(opt);
    await toast.present();
    const { role } = await toast.onDidDismiss();
    return role;
  }
  async showModal(options: ModalOptions) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    const { role } = await modal.onDidDismiss();
    return { role };
  }
  async showModalOrPopover(options: ModalOptions | PopoverOptions) {
    if (this.platform.is('desktop')) {
      return await this.showPopover(options);
    }
    return this.showModal(options);
  }
}
