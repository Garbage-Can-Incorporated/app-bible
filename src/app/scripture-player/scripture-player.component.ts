import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { PlayerService } from '../services/player.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-scripture-player',
  templateUrl: './scripture-player.component.html',
  styleUrls: ['./scripture-player.component.css']
})
export class ScripturePlayerComponent implements OnInit, OnChanges {
  @Input() public passages: Array<string>;
  @Output() public watchFocus: EventEmitter<number> = new EventEmitter();
  public repeatAll = <boolean>false;
  public playerState = <boolean> false;
  public initial = <number> 0;

  constructor(
    private _player: PlayerService,
    private _snackbar: SnackbarService
  ) { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.passages !== undefined) {
      this.passages = this.passages;
    }
  }

  public toggleRepeat(): void {
    this.repeatAll = !this.repeatAll;
  }

  public previous(): void {
    this.playerState = false;
    this.stopPlay();
    this.initial -= 1;

    if (this.passageUnderflow) {
      this.initial = 0;
    }

    // this.watchFocus.emit(this.initial);
    console.log({ _init: this.initial });
    this.playChapter();
  }

  public next(): void {
    this.playerState = false;
    this.stopPlay();
    this.initial += 1;

    if (this.passageOverflow) {
      this.initial = 0;
    }

    // this.watchFocus.emit(this.initial);
    this.playChapter();
  }

  public playChapter() {
    this.playerState = true;

    if (this.initial === 0) {
      this.watchFocus.emit(this.initial);
    }

    this._player
      .play(this.passages[ this.initial ])
      .subscribe(
        (data) => console.log({ data }),
        // scrollIntoView
        (error) => {
          console.log({ error });
          this.stopPlay();
          this._snackbar
            .showSnackbar(
              `
              Internet isn't available. Please retry when the internet is available
              `);
        },
        () => {
          // end of list EOL
          if (this.EOPassage) {
            console.log(`=========`);
            this.playerState = false;
            console.log(`stopping player`, {prev: this.initial});
            this.initial = 0;
            this.watchFocus.emit(0);
            console.log(
              `stopping player`,
              {current: this.initial, playerState: this.playerState, repeatAll: this.repeatAll}
            );
            console.log(`=========`);
            this.stopPlay();

            // repeat all if repeat enabled
            if (this.repeatAll === true) {
              this.playChapter();
            }
          }

          // play next on the list
          if (this.playerState === true) {
            console.log(`=========`);
            console.log(`playing next on the list`, {prev: this.initial, next: this.initial + 1});
            this.initial += 1;
            this.watchFocus.emit(this.initial); // - removed
            this.playChapter();
            console.log(`=========`);
          }
        }
      );
  }

  public pause(): void {
    this._player.pause();
  }

  public stopPlay(): void {
    this._player.stop();
  }

  public togglePlayerState(): void {
    this.playerState = !this.playerState;
  }

  private get passageUnderflow(): boolean {
    return this.initial < 0;
  }

  private get passageOverflow(): boolean {
    return this.initial >= this.passages.length;
  }

  private get EOPassage(): boolean {
    return (this.initial) === (this.passages.length - 1);
  }
}
