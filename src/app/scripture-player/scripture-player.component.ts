import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-scripture-player',
  templateUrl: './scripture-player.component.html',
  styleUrls: ['./scripture-player.component.css']
})
export class ScripturePlayerComponent implements OnInit, OnChanges {
  @Input() public passages: Array<string>;
  @Input() public itemFocus: number;
  @Output() public watchFocus: EventEmitter<number> = new EventEmitter();
  private focusElementNo: number;
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
      this.focusElementNo = this.itemFocus;
    }
  }

  public toggleRepeat(): void {
    this.repeatAll = !this.repeatAll;
  }

  public previous(): void {
    this.stopPlay();

    // calling play
    this.initial -= 2;
    this.playChapter();
  }

  public next(): void {
    this.stopPlay();
    if (this.initial === 0) { ++this.initial; }
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
          console.log('last played => ', { lastPlayed: this.initial });

          ++this.initial;
          console.log('currently being played', { currentlyPlayed: this.initial });

          if (this.initial === this.passages.length) {
            this.stopPlay();
            this.initial = 0;

            // repeat all
            if (this.repeatAll === true) {
              this.playChapter();
            }
          }

          if (this.playerState === true) {
            this.playChapter();
          }

          this.focusElementNo = this.initial;
          this.watchFocus.emit(this.focusElementNo);
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
}
