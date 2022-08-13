import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
})
export class RoomItemComponent implements OnInit {
  @Input() room: any;
  constructor(private router:Router,private activeRoute:ActivatedRoute) { }

  ngOnInit() {}
  selectRoom(roomId) {
    console.log(roomId);
 
    this.activeRoute.paramMap.subscribe((params : ParamMap)=> {  
       
    
      
  });
  
}
}
