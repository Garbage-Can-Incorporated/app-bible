import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { PlayerService } from '../services/player.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-reaction-console',
  templateUrl: './reaction-console.component.html',
  styleUrls: ['./reaction-console.component.css']
})
export class ReactionConsoleComponent implements OnInit, OnChanges {
  @Input() passage: string;
  public playerState: boolean = <boolean>false;

  public show = <boolean> false;
  @Input() favIconActive: boolean;

  constructor(
    private _player: PlayerService,
    private _snackbar: SnackbarService
  ) { }

  ngOnInit() { }

  ngOnChanges(): void { }
  public toggleIconsVisibility(): void {
    this.show = !this.show;
  }

  public readVerse(playIcon: Element): void {
    /*
    * to avoid multiple verse queue and collision,
    * stop whatever is being played first
    */
    this.stopPlay();
    // this.playerState = true;
    this.toggleVersePlay(playIcon, this.passage);
  }

  private toggleVersePlay(icon: Element, content: string): void {
    if (icon.classList.contains('fa-pause')) {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');

      icon.classList.remove('__blue--color');

      this._player.pause();
    } else {
      this.playerState = true;

      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');

      icon.classList.add('__blue--color');

      this._player.play(content)
        .subscribe(
          (data) => console.log(data),
          (error) => {
            console.log(error);
            this.stopPlay();
            icon.classList.replace('fa-pause', 'fa-play');
            icon.classList.remove('__blue--color');

            this.playerState = false;
            this._snackbar
              .showSnackbar(
                `
              Internet isn't available. Please retry when the internet is available
              `);
          },
          () => {
            console.log('complete!');
            icon.classList.replace('fa-pause', 'fa-play');
            icon.classList.remove('__blue--color');

            this.playerState = false;
          }
        );
    }
  }

  public stopPlay(): void {
    this._player.stop();
    this.togglePlayerState();
  }

  public togglePlayerState(): void {
    this.playerState = !this.playerState;
  }
}
