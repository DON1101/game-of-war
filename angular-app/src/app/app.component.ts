import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
      "../../node_modules/bootstrap/dist/css/bootstrap.min.css",
      "../../node_modules/bootstrap-select/dist/css/bootstrap-select.min.css",
      './app.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
}
