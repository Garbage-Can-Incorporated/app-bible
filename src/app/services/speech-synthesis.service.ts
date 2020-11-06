import { Injectable } from '@angular/core';

import { Observable, Subject, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechSynthesisService {
  private synth: SpeechSynthesis = window.speechSynthesis;
  private volume: number;
  private pitch = <number>1;
  private rate = <number>1;
  private voicesList: any[];
  private voicesReadySubject: Subject<any> = new Subject();

  constructor() {
    this.voicesReadySubject
      .subscribe(() => {
        console.log('[Voice changed] voices arrived');
        this.synth.resume();
      });
    this.synth.onvoiceschanged = function(this: SpeechSynthesis, ev: Event): any {
      this.getVoices();
    };
  }

  public play (content: string): Observable<any> {
    return new Observable(
      (obs) => {
        console.log(`playing...`, {synth: this.synth});

        this.resumeSpeaking(obs);

        const utterance = this.speechSynthUtterance(content);
        const extras = this.getExtras;
        utterance.volume = extras.volume || this.volume;
        utterance.lang = `en-NG`;
        utterance.pitch = extras.pitch || this.pitch;
        utterance.rate = extras.rate || this.rate;

        if (this.voicesList.length !== 0) {
          utterance.voice = this.voicesList[this.preferedVoice()];

          this.synth.speak(utterance);
          obs.next({status: true, msg: 'Success!', synth: this.synth});

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

  public resumeSpeaking(obs?: Subscriber<any>): void {
    if ((this.synth.paused || this.synth.speaking) === true) {
      // console.log('was speaking!');
      console.log('was paused!');

      this.synth.resume();
      obs.next({ status: true, msg: 'Resumed speaking', synth: this.synth });

      return;
    }
  }

  public stop(): void {
    this.synth.cancel();
  }

  public isPaused(): boolean {
    return this.synth.paused;
  }

  public pause(): void {
    if (this.synth.paused === false) {
      this.synth.pause();
      console.log('original pause', {synth: this.synth});
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
    console.log(`[Get Voices]`, {voicesList: this.voicesList});
    this.voicesReadySubject.next(this.voicesList);
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
