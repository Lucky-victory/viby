import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-new-channel-form',
  templateUrl: './new-channel-form.component.html',
  styleUrls: ['./new-channel-form.component.scss'],
})
export class NewChannelFormComponent implements OnInit {
  channelName: string = '';
  isPublic: boolean = true;
  isMobile: boolean;
  constructor(private modalCtrl: ModalController, private platform: Platform) {
    this.isMobile = this.platform.is('mobile');
  }

  ngOnInit() {}
  createChannel() {}
  dismiss = async () => {
    this.modalCtrl.dismiss();
  };
}
