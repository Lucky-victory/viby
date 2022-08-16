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

const config: SocketIoConfig = {
	url: environment.socketUrl, // socket server url;
	options: {
		transports: ['websocket']
	}
}
@NgModule({
  declarations: [AppComponent,],
  imports: [BrowserModule, IonicModule.forRoot(),		SocketIoModule.forRoot(config),  AppRoutingModule,HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },UtilsService, ChatService, ApiService,AuthService, {
    provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptorService,
    multi: true
  },{
    provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
