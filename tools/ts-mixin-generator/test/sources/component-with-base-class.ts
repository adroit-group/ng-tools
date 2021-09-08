import { Component } from '@angular/core';
import { TestBaseClass } from './base-class';

@Component({
  selector: 'adroit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class TestComponent extends TestBaseClass {}
