import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SpotifyModule } from 'angular-spotify'; // Modulo de spotify (discoverify\src\angular-spotify.d.ts)

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,

    // Config del módulo de Spotify
    // Cliente secret: 90bdd6d2ad06437185aa0eeda7bb1fc8
    // Client id: 3881fb07520a491f9090ad3ebc97ccb8
    // Redirect URIs (En caso de error, sucecs, failrule, etc): http://localhost:8100/errorview
    
    SpotifyModule.forRoot({
      clientId: 'ABC123DEF456GHI789JKL', // Cambiar por el client id de la app de Spotify.
      redirectUri: 'http://www.example.com/callback.html',
      scope:
        'user-read-private playlist-read-private playlist-modify-private playlist-modify-public',
      showDialog: true,
      authToken: 'zoasliu1248sdfuiknuha7882iu4rnuwehifskmkiuwhjg23',
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
