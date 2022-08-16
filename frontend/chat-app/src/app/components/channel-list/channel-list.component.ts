import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IChannel } from 'src/app/interfaces/channel.interface';
import { IUser } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
})
export class ChannelListComponent implements OnInit {
  @Input() channels: any;
  channelId: string;
  constructor(private activeRoute:ActivatedRoute) { }

  ngOnInit() {

    // use the active channelId to fetch rooms
    this.activeRoute.paramMap.subscribe((params) => {
   this.channelId=   params.get('channel_id')
// now use the channeelID
      
    })
  }

}
