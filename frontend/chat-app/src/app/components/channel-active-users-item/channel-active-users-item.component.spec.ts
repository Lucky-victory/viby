import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChannelActiveUsersItemComponent } from './channel-active-users-item.component';

describe('ChannelActiveUsersItemComponent', () => {
  let component: ChannelActiveUsersItemComponent;
  let fixture: ComponentFixture<ChannelActiveUsersItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelActiveUsersItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelActiveUsersItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
