import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appTwitterShare]'
})
export class TwitterShareDirective {
  private url = <string> `https://twitter.com/intent/tweet`;
  @Input() public text: string;
  private hashtags = <string> `ev'ryword`;
  private via = <string>'ev\'ryword';

  constructor(
    private router: Router
  ) { }

  @HostListener('click', [ '$event' ])
  onClick(e: Event): void { }
}
