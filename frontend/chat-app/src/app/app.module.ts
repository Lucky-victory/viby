import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api/api.service';
import { AuthService } from './services/auth/auth.service';
import { ChatService } from './services/chat/chat.service';
import { HttpAuthInterceptorService } from './services/http-auth-interceptor/http-auth-interceptor.service';
import { HttpErrorInterceptorService } from './services/http-error-interceptor/http-error-interceptor.service';
import { UtilsService } from './services/utils/utils.service';
import { WebSocketService } from './services/web-socket/web-socket.service';
import { SeoService } from './services/seo/seo.service';
import { ChatRoomGuard } from './guards/chat-room/chat-room.guard';

const config: SocketIoConfig = {
  url: environment.socketUrl, // socket server url;
  options: {
    transports: ['websocket'],
    autoConnect: false,
  },
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    WebSocketService,
    UtilsService,
    ChatService,
    ApiService,
    AuthService,
    SeoService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
