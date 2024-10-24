import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { NotFoundComponenteComponent } from './components/not-found-componente/not-found-componente.component';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite


@NgModule({
  declarations: [AppComponent, SplashScreenComponent, NotFoundComponenteComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,// Se añade el servicio AuthService a la lista de proveedores.
    SQLite // Agrega SQLite a los proveedores
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
