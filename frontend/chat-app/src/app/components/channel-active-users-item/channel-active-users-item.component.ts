import { Component, Input, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'channel-active-users-item',
  templateUrl: './channel-active-users-item.component.html',
  styleUrls: ['./channel-active-users-item.component.scss'],
})
export class ChannelActiveUsersItemComponent implements OnInit {
  @Input() currentUser: IUser;
  @Input() member: IUser;
  constructor() { }

  ngOnInit() {}

}
