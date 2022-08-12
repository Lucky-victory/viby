import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'channel-active-users-item',
  templateUrl: './channel-active-users-item.component.html',
  styleUrls: ['./channel-active-users-item.component.scss'],
})
export class ChannelActiveUsersItemComponent implements OnInit {
  @Input() user;
  constructor() { }

  ngOnInit() {}

}
