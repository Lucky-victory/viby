import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IResponse } from 'src/app/interfaces/common.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { IUser, IUserToView } from 'src/app/interfaces/user.interface';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'channel-active-users-list',
  templateUrl: './channel-active-users-list.component.html',
  styleUrls: ['./channel-active-users-list.component.scss'],
})
export class ChannelActiveUsersListComponent implements OnInit {
  private currentUser: IUserToView;
  members: IUserToView[] = [];
  channelId: string;
  activeRoom: IRoom;
  constructor(
    private activeRoute: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService.membersInRoom$.subscribe((members) => {
      this.members = members;
    });

    // this.chatService.getRoom()
  }
}
