import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { PlayerService } from '../services/player.service';

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
    private _player: PlayerService
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
    this.stopPlay();

    // calling play
    this.initial -= 2; // check
    this.playChapter();
  }

  public next(): void {
    this.stopPlay();

    // if (this.initial === 0) { this.initial += 1; }
    // this.initial += 1;

    this.playChapter();
  }

  public playChapter() {
    this.playerState = true;

    this._player
      .play(this.passages[ this.initial ])
      .subscribe(
        (data) => console.log({ data }),
        // scrollIntoView
        (error) => {
          console.log({ error });
          this.stopPlay();
        },
        () => {
          console.log('done!');
          console.log('last played => ', { lastPlayed: this.initial + 1 });

          // end of list EOL
          if (this.EOPassage) {
            this.stopPlay();
            this.initial = 0;

            // repeat all if repeat enabled
            if (this.repeatAll === true) {
              this.playChapter();
            }
          }

          // play next on the list
          if (this.playerState === true) {
            this.initial += 1;
            console.log('currently being played', { currentlyPlayed: this.initial + 1 });
            this.playChapter();
          }

          this.watchFocus.emit(this.initial + 1);
        }
      );
  }

  public pause(): void {
    this._player.pause();
  }

  public stopPlay(): void {
    this._player.stop();
    this.togglePlayerState();
    this.playerState = false;
    // this._playerState = false;
  }

  public togglePlayerState(): void {
    this.playerState = !this.playerState;
  }

  private get TOPassage(): boolean {
    return this.initial === 0;
  }

  private get EOPassage(): boolean {
    return (this.initial + 1) >= this.passages.length;
  }
}
