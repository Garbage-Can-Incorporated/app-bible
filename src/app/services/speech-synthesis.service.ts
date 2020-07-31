import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechSynthesisService {
  private synth: SpeechSynthesis = window.speechSynthesis;
  private volume: number;
  private pitch = <number>1;
  private rate = <number>1;
  private voicesList: any[];

  constructor( ) {
    this.synth.onvoiceschanged = function(this: SpeechSynthesis, ev: Event): any {
      this.getVoices();
    };
  }

  public play (content: string): Observable<any> {
    return new Observable(
      (obs) => {
        if (this.synth.speaking === true) {
          console.log('was speaking!');

          this.synth.resume();

          obs.next({ status: true, msg: 'Resumed speaking' });
          return;
        }

        const utterance = this.speechSynthUtterance(content);
        const extras = this.getExtras;
        utterance.volume = extras.volume || this.volume;
        utterance.lang = `en-NG`;
        utterance.pitch = extras.pitch || this.pitch;
        utterance.rate = extras.rate || this.rate;
        console.log({extras});

        if (this.voicesList.length !== 0) {
          utterance.voice = this.voicesList[
            this.preferedVoice()
          ];

          this.synth.speak(utterance);
          obs.next({status: true, msg: 'Success!'});

          utterance.onend = () => {
            obs.complete();
          };
        } else {
          console.log('voice models depends on the internet');

          obs.error({
            status: false,
            msg: 'voice models depends on the internet'
          });
        }
      }
    );
  }

  public stop(): void {
    this.synth.cancel();
  }

  public pause(): void {
    if (this.synth.paused === false) {
      this.synth.pause();
      console.log('original pause');
      return;
    }
  }

  public isPending(): boolean {
    return this.synth.pending;
  }

  private speechSynthUtterance(content: string) {
    return new SpeechSynthesisUtterance(content);
  }

  public setVolume(level: number = 0.5): void {
    this.volume = level;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    this.voicesList = speechSynthesis.getVoices();
    return this.voicesList;
  }

  public isVoiceAvailable(): any[] {
    this.getVoices();
    return this.voicesList;
  }

  public __init__ (): void {
    this.setVolume();
    this.getVoices();
  }

  public preferedVoice(): number {
    const settings = this.getSettings;
    return settings ? settings.voice : 1;
  }

  private get getExtras(): {pitch: number, rate: number, volume: number} {
    return this.getSettings ? this.getSettings.extra : {} as {pitch: number, rate: number, volume: number};
  }

  private get getSettings(): {voice: number, extra: {pitch: number, rate: number, volume: number}} {
    return JSON.parse(window.localStorage.getItem('settings'));
  }
}
