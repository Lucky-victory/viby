import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
      this.activeRoute.paramMap.subscribe((params) => {
     this.channelId=   params.get('channel_id')
        
        
      })
  }

}
