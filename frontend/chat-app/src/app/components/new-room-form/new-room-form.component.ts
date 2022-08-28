import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-room-form',
  templateUrl: './new-room-form.component.html',
  styleUrls: ['./new-room-form.component.scss'],
})
export class NewRoomFormComponent implements OnInit {
  roomName: string = '';
  messageAllowed: boolean = true;
  constructor() {}

  ngOnInit() {}
  createRoom() {}
  dismiss() {}
}
