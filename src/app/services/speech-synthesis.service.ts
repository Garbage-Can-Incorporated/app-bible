import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechSynthesisService {
  private synth = window.speechSynthesis;
  private volume: number;
  private pitch = 1;
  private rate = 1;
  private voicesList: SpeechSynthesisVoice[];

  constructor() { }

  // WARNING returns new observable everytime
  public play (content: string): Observable<any> {
    this.initSetup();

    return new Observable(
      (obs) => {
        if (this.synth.paused === true || this.synth.speaking === true) {
          console.log('[Synth] was paused/speaking!');

          this.synth.resume();
          obs.next({ status: true, msg: 'Resumed speaking' });

          return;
        }

        const utterance = this.speechSynthUtterance(content);
        utterance.volume = this.volume;
        utterance.lang = `en-NG`;
        utterance.pitch = this.pitch;
        utterance.rate = this.rate;

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
          console.log('[Synth] voice models depends on the internet');

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
    if (this.synth.paused === true) {
      console.log('[Synth] pause', this.synth.paused);
      this.synth.pause();
    } else {
      console.log('[Synth] resume', this.synth.paused);
      this.synth.resume();
    }
  }

  public isPending(): boolean {
    return this.synth.pending;
  }

  private speechSynthUtterance(content) {
    return new SpeechSynthesisUtterance(content);
  }

  public setVolume(level: number = 0.5): void {
    this.volume = level;
  }

  public getVolume(): number {
    return this.volume;
  }

  private getVoices(): any[] {
    // console.log({ voicesAvailable: this.synth.getVoices() });
    this.voicesList = this.synth.getVoices();

    return this.voicesList;
  }

  public isVoiceAvailable(): any[] {
    this.getVoices();
    return this.voicesList;
  }

  public initSetup(): void {
    this.setVolume();
    this.getVoices();
  }

  public preferedVoice(): number {
    return this.voicesList.findIndex(
      (cur) => cur.lang === 'en-US' ||
                cur.voiceURI === 'Google US English' ||
                cur.name === 'Google US English' ||
                (
                  cur.name.includes('English') &&
                  cur.lang === 'en-US' &&
                  cur.voiceURI.includes('Microsoft') &&
                  (cur.voiceURI.includes('David') || cur.voiceURI.includes('Zira'))
                  )
    );
  }
}
