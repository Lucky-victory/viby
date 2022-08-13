import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.page.html',
  styleUrls: ['./channels.page.scss'],
})
export class ChannelsPage implements OnInit {
  storeUrl: string = '../../../assets/store.json'
  servers:any
  activeChannel: any;
  constructor(private apiService :ApiService,private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.apiService.get(this.storeUrl).subscribe((result:any) => {
      this.servers = result.servers;
      this.activeChannel = result.servers[1];
      this.activeRoute.paramMap.subscribe((params) => {
     const channelId=   params.get('channel_id')
        const roomId = params.get('room_id');
        console.log(channelId);
        console.log(roomId);
        
      })
})
  }

}
