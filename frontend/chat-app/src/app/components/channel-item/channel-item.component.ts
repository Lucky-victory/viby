import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'channel-item',
  templateUrl: './channel-item.component.html',
  styleUrls: ['./channel-item.component.scss'],
})
export class ChannelItemComponent implements OnInit {
  @Input() isActive: boolean;
  @Input() channel:any
  constructor() { }

  ngOnInit() {}

}
