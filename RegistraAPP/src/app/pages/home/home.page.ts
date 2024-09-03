import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userEmail: string = '';

  constructor( // Constructor para iniciar el pass de datos dentro de la page de login a la page home,
               // En este caso es respecto al usuario que se ha logeado.
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.userEmail = this.router.getCurrentNavigation()?.extras.state?.['userEmail'];
      }
    });
    addIcons({ add });
  }

  ngOnInit() {
  }
}
