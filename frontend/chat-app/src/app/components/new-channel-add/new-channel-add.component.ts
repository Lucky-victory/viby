import { UtilsService } from 'src/app/services/utils/utils.service';
import { Component, OnInit } from '@angular/core';
import { NewChannelFormComponent } from '../new-channel-form/new-channel-form.component';

@Component({
  selector: 'new-channel-add',
  templateUrl: './new-channel-add.component.html',
  styleUrls: ['./new-channel-add.component.scss'],
})
export class NewChannelAddComponent implements OnInit {
  private canDismiss = false;
  constructor(private utilsService: UtilsService) {}

  ngOnInit() {}
  showModal = async () => {
    await this.utilsService.showModal({
      component: NewChannelFormComponent,
      backdropDismiss: false,
    });
  };
}
