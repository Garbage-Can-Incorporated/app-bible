import { Component } from '@angular/core';

@Component({
  selector: 'ewd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() { }

  public onActivated(e): void {
    console.log({e});
  }

  public onDeactivated(e): void {
    console.log({e});
  }
}
