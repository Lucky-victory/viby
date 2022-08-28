import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-channel-form',
  templateUrl: './new-channel-form.component.html',
  styleUrls: ['./new-channel-form.component.scss'],
})
export class NewChannelFormComponent implements OnInit {

 channelName: string;
  isPublic: boolean;
  constructor() { }

  ngOnInit() {}
  createRoom() {
  
  }
  dismiss() {
    
  }
}
