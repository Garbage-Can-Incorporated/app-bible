import { Injectable } from '@angular/core';

import { Observable, asyncScheduler } from 'rxjs';
import { observeOn, mergeAll } from 'rxjs/operators';

import { SpeechSynthesisService } from './speech-synthesis.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
    private _speechSynth: SpeechSynthesisService
  ) {  }

  public PlayChapter(passages: any[]): Observable<any> {
    this.initSpeechSynth();

    return new Observable(
      (obs) => {
        passages.forEach((cur, i) => {
          obs.next(
            this._speechSynth
              .play(cur)
          );

          if ((i + 1) === passages.length) {
            obs.complete();
          }
      });
    })
    .pipe(
      observeOn(asyncScheduler),
      mergeAll(1)
    );
  }

  public play(content: string): Observable<any> {
    this.initSpeechSynth();

    return this._speechSynth.play(content);
  }

  public pause(): void {
    this._speechSynth.pause();
  }

  public stop(): void {
    this._speechSynth.stop();
  }

  private initSpeechSynth(): void {
    this._speechSynth.__init__();
  }

  public get isPending(): boolean {
    return this._speechSynth.isPending();
  }
}
