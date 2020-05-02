import { Directive, HostListener, Input } from '@angular/core';

import { RendererBwService } from '../services/renderer-bw.service';

@Directive({
  selector: '[appTwitterShare]'
})
export class TwitterShareDirective {
  private url = <string> `https://twitter.com/intent/tweet?`;
  @Input() public text: string;
  private hashtags = <string> `ev'ryword`;

  constructor(
    private _bwService: RendererBwService
  ) { }

  @HostListener('click', [ '$event' ])
  onClick(e: Event): void {
    this._bwService
      .createWindow(
        this.url,
        {
          text: this.text, hashtags: this.hashtags, via: `ev'ryword`
        }
      )
      .then((value) => console.log(`[BW] window opened successfully ${value}`))
      .catch((err) => console.log(`[BW] An error occured ${err}`));
  }
}
