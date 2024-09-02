import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

// Documentación de infinite scroll
// https://ionicframework.com/docs/api/infinite-scroll

export class HomePage implements OnInit {
  items = [];

  ngOnInit() {
    for (let i = 1; i < 51; i++) {
    }
  }
}

// DOCUMENTACIÓN BOTÓN ADD: https://ionicframework.com/docs/api/fab
export class ExampleComponent {
  constructor() {
    /**
     * Any icons you want to use in your application
     * can be registered in app.component.ts and then
     * referenced by name anywhere in your application.
     * 
     * DOCUMENTACIÓN : https://ionicframework.com/docs/api/fab
     */
    addIcons({ add });
  }
}