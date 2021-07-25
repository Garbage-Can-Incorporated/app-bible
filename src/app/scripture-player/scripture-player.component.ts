import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { IScriptures } from '../interfaces/i-scriptures';
import { LastReadService } from '../services/last-read.service';
import { SpeechSynthesisService } from '../services/speech-synthesis.service';

@Component({
  selector: 'ewd-scripture-player',
  templateUrl: './scripture-player.component.html',
  styleUrls: ['./scripture-player.component.scss']
})
export class ScripturePlayerComponent implements OnInit, OnChanges {
  @Input() public scripture: IScriptures;
  @Input() public passages: Array<string>;
  @Output() public watchFocus: EventEmitter<number> = new EventEmitter();
  public repeatAll = false;
  public playerState = false;
  public pauseState = false;
  public stopState = false;
  public initial = 0;

  constructor(
    private speechSynth: SpeechSynthesisService,
    private lastRead: LastReadService
  ) { }

  ngOnInit() {
    this.lastRead.lastReadSubject
      .subscribe((scripture) => {
        this.scripture = scripture;
        this.initial = this.scripture.verse - 1;
      });
  }

  ngOnChanges() {
    if (this.passages !== undefined) {
      this.passages = this.passages;
    }

    if (this.scripture !== undefined) {
      // INFO index is zero-based
      this.initial = this.scripture.verse - 1;
    }
  }

  public toggleRepeat(): void {
    this.repeatAll = !this.repeatAll;
  }

  public previous(): void {
    this.stopState = true;
    this.stopPlay();
    this.initial -= 1;

    if (this.passageUnderflow) {
      this.initial = 0;
    }

    console.log({ prev: this.initial });
    this.playChapter();
  }

  public next(): void {
    this.stopState = true;
    this.stopPlay();
    this.initial += 1;

    if (this.passageOverflow) {
      this.initial = 0;
    }

    console.log({ next: this.initial });
    this.playChapter();
  }

  public playChapter() {
    this.playerState = true;
    this.pauseState = true;
    this.stopState = false;

    this.speechSynth
      .play(this.passages[ this.initial ])
      .subscribe(
        (data) => console.log({ data }),
        // scrollIntoView
        (error) => {
          console.log({ error });
          this.stopPlay();
        },
        () => {
          console.log('[Scripture Player] done!');

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
          if (this.pauseState === true && this.stopState === false) {
            this.initial += 1;
            // console.log('[Scripture Player] currently being played', { currentlyPlayed: this.initial + 1 });
            this.playChapter();
            this.scripture.verse = this.initial + 1;
            this.lastRead.setLastRead(this.scripture);
          }

          this.watchFocus.emit(this.initial + 1);
        }
      );
  }

  public pause(): void {
    this.speechSynth.pause();
    this.pauseState = false;
  }

  public stopPlay(): void {
    this.playerState = false;
    this.speechSynth.stop();
  }

  private get passageUnderflow(): boolean {
    return this.initial < 0;
  }

  private get passageOverflow(): boolean {
    return this.initial >= this.passages.length;
  }

  private get EOPassage(): boolean {
    return (this.initial + 1) >= this.passages.length;
  }
}
