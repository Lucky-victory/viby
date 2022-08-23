import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  constructor(private route: ActivatedRoute) {
    const ch = this.route.snapshot.paramMap.get('channel_id');
    console.log(ch, 'fyguhijokpcgvhjk');
  }

  ngOnInit() {}
}
