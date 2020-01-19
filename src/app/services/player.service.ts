import { Injectable } from '@angular/core';

import { SpeechSynthesisService } from './speech-synthesis.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
    private _speechSynth: SpeechSynthesisService
  ) { }

  public play(content: string): void {
    this._speechSynth.play(content);
  }

  public pause(): void {
    this._speechSynth.pause();
  }

  public stop(): void {
    this._speechSynth.stop();
  }

  public get isPending():boolean {
    return this._speechSynth.isPending();
  }
}
