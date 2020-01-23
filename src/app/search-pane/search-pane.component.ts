import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-search-pane',
  templateUrl: './search-pane.component.html',
  styleUrls: ['./search-pane.component.css']
})
export class SearchPaneComponent implements OnInit {
  @Output() closePane: EventEmitter<boolean> = new EventEmitter<boolean>();

  public query: string;

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.el.nativeElement
    .children[0]
    .addEventListener('click', (e) => {
      console.log({e});

      this.collapseButton();
    });
  }

  public collapseButton() {
    this.closePane.emit(false);
  }

  public grabInput(): void {
    console.log({q: this.query});
  }
}
