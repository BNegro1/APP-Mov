import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  animations: [
    trigger('fadeOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('in => out', animate('500ms ease-out'))
    ]),
    trigger('moveUpAndFade', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      state('out', style({ transform: 'translateY(-100%)', opacity: 0 })),
      transition('void => in', [
        animate('1500ms ease-out', keyframes([
          style({ transform: 'translateY(100%)', opacity: 0, offset: 0 }),
          style({ transform: 'translateY(50%)', opacity: 1, offset: 0.5 }),
          style({ transform: 'translateY(0)', opacity: 1, offset: 1 })
        ]))
      ]),
      transition('in => out', [
        animate('1500ms ease-out', keyframes([
          style({ transform: 'translateY(0)', opacity: 1, offset: 0 }),
          style({ transform: 'translateY(-30%)', opacity: 1, offset: 0.3 }), // Rebote hacia arriba
          style({ transform: 'translateY(0)', opacity: 1, offset: 0.5 }), // Vuelve al centro
          style({ transform: 'translateY(-100%)', opacity: 0, offset: 1 }) // Llega al final
        ]))
      ])
    ]),
    trigger('fadeIn', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('void => in', [
        style({ opacity: 0 }),
        animate('1000ms 1000ms ease-out', style({ opacity: 1 }))
      ]),
      transition('in => out', animate('100ms ease-out'))
    ])
  ]
})
export class SplashScreenComponent implements OnInit {
  state: 'in' | 'out' = 'in';

  constructor(private animationCtrl: AnimationController) { }

  ngOnInit() {
    setTimeout(() => {
      this.state = 'out';
    }, 2500);
  }
}