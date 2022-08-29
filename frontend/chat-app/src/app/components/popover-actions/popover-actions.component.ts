import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'popover-actions',
  templateUrl: './popover-actions.component.html',
  styleUrls: ['./popover-actions.component.scss'],
})
export class PopoverActionsComponent implements OnInit {
  @Input() buttons;
  constructor(private popoverCtrl: PopoverController) {}

  ngOnInit() {}
  onClick(button) {
    this.popoverCtrl.dismiss(button?.data);
  }
}
