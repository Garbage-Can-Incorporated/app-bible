import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechSynthesisService {
  private synth = window.speechSynthesis;
  private volume: number;

  constructor() {
    this.setVolume();
  }

  public play(content: string): void {
    if (this.synth.paused) {
      this.synth.resume();
      return;
    }

    const utterance = this.speechSynthUtterance(content);
    utterance.volume = this.volume;
    utterance.lang = `en-NG`;

    this.synth.speak(utterance);
  }

  public stop(): void {
    this.synth.cancel();
  }

  public pause(): void {
    if (!this.synth.paused) {
      this.synth.pause();
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
}
