import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular'; // Implementar a futuro (Infinite scroll)
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

// El constructor logra recibe datos de la page anterior (login) y prepara el icono del usuario.

export class HomePage implements OnInit {
  userEmail: string = ''; // Definimos el display de userEmail como un string vacio

  constructor( // Constructor para iniciar el pass de datos dentro de la page de login a la page home,
               // En este caso es respecto al usuario que se ha logeado.
    private route: ActivatedRoute, // Proporciona acceso a información sobre la ruta ASOCIADA al componente.
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => { // El query observa cambios de los parametros de la URL, en este caso, el username/correo.
      if (this.router.getCurrentNavigation()?.extras.state) { // Dentro del query, verifica que esté el parametro (usermane/correo)
        this.userEmail = this.router.getCurrentNavigation()?.extras.state?.['userEmail']; // Condicional -> Si existe = obtiene el valor de userEmail.
      }
    });
    addIcons({ add });
  }

  ngOnInit() {
  }
}
