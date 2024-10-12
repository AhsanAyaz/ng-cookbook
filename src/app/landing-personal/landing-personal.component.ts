import { Component } from '@angular/core';
import { BehaviorsDirective } from '../directives/behaviors.directive';
import { FeatherModule } from 'angular-feather';
import { BookHeightDirective } from '../directives/book-height.directive';

@Component({
  selector: 'app-landing-personal',
  standalone: true,
  imports: [BehaviorsDirective, FeatherModule, BookHeightDirective],
  templateUrl: './landing-personal.component.html',
  styleUrl: './landing-personal.component.scss',
})
export class LandingPersonalComponent {}
