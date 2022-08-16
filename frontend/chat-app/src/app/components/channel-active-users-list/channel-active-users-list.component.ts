import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'channel-active-users-list',
  templateUrl: './channel-active-users-list.component.html',
  styleUrls: ['./channel-active-users-list.component.scss'],
})
export class ChannelActiveUsersListComponent implements OnInit {
  @Input() currentUser:IUser;
  @Input() members: IUser[];
  channelId: string;
  constructor(private activeRoute: ActivatedRoute) {
    
   }

  ngOnInit() {
    // use the current active channelId to fetch members
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
      // fetch members with channelId  
    })
  }

}
