import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-pane',
  templateUrl: './search-pane.component.html',
  styleUrls: ['./search-pane.component.css']
})
export class SearchPaneComponent implements OnInit {
  @Output() closePane = new EventEmitter<boolean>();

  public query: string;

  constructor() { }

  ngOnInit() {
  }

  public collapseButton() {
    this.closePane.emit(false);
  }

  public grabInput(): void {
    console.log({q: this.query});
  }
}
