import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { NotFoundComponenteComponent } from './components/not-found-componente/not-found-componente.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { IonicStorageModule } from '@ionic/storage-angular';
import { environment } from '../environments/environment'; // Importa la configuración de Firebase

@NgModule({
  declarations: [
    AppComponent,
    SplashScreenComponent,
    NotFoundComponenteComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, // Módulo para autenticación con Firebase
    AngularFirestoreModule, // Módulo para Firestore
    IonicStorageModule.forRoot(), // Inicializa el módulo de almacenamiento de Ionic
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
