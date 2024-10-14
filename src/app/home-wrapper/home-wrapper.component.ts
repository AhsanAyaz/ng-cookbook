import { Component } from '@angular/core';
import { LandingPersonalComponent } from '../landing-personal/landing-personal.component';

@Component({
  selector: 'app-home-wrapper',
  standalone: true,
  imports: [LandingPersonalComponent],
  templateUrl: './home-wrapper.component.html',
  styleUrl: './home-wrapper.component.scss',
})
export class HomeWrapperComponent {}
