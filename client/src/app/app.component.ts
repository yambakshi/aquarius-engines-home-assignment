import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.common.scss',
    './app.component.mobile.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
