import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'channel-active-users-list',
  templateUrl: './channel-active-users-list.component.html',
  styleUrls: ['./channel-active-users-list.component.scss'],
})
export class ChannelActiveUsersListComponent implements OnInit {
  @Input() user;
  constructor() { }

  ngOnInit() {}

}
