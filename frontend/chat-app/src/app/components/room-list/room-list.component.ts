import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  @Input() channel = {};
  @Input()
  rooms = [{
    room_id: '1',
    title: 'general',
    channel_id: '1',
    allow_messages: true,

  },{
    room_id: '2',
    title: 'help',
    channel_id: '1',
    allow_messages: true,

  },]
  constructor() { }

  ngOnInit() {}

}
