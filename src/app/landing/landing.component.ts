import { Component } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { BehaviorsDirective } from '../directives/behaviors.directive';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FeatherModule, BehaviorsDirective],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
