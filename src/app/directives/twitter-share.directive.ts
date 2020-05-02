import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTwitterShare]'
})
export class TwitterShareDirective {
  private url = <string> `https://twitter.com/intent/tweet?`;
  @Input() public text: string;
  private hashtags = <string> `ev'ryword`;

  constructor() { }

  @HostListener('click', [ '$event' ])
  onClick(e: Event): void {
    // use url directly
  }
}
