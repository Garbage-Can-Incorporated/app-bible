import {Component, OnInit} from '@angular/core';

import {MatSliderChange} from '@angular/material/slider';

import {SpeechSynthesisService} from '../services/speech-synthesis.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public voiceList: Array<SpeechSynthesisVoice> = [];
  public voiceIndex: number;
  public volumeValue: number = <number>0.5 * 100;
  public altVolumeValue: number = <number>0;
  public pitchValue: number = <number>1;
  public rateValue: number = <number>1;

  constructor(private speech: SpeechSynthesisService) { }

  ngOnInit() {
    this.getVoices();
    this.voiceIndex = this.getDefaultVoiceList;
    this.getExtras();
  }

  private getExtras(): void {
    if (this.getSettings) {
      const extra = this.getSettings.extra;

      this.volumeValue = extra ? (extra.volume / 2) * 100 : this.volumeValue;
      this.rateValue = extra.rate || this.rateValue;
      this.pitchValue = extra.pitch || this.pitchValue;
    }
  }

  public sliderChange(choice: number, e: MatSliderChange): void {
    // set volume
    if (choice === 0) {
      this.altVolumeValue = (e.value / 100) * 2;
      this.setExtras(choice);
    }

    // set pitch
    if (choice === 1) {
      this.pitchValue = e.value;
      this.setExtras(choice);
    }

    // set pitch
    if (choice === 2) {
      this.rateValue = e.value;
      this.setExtras(choice);
    }
  }

  private setExtras(choice: number): void {
    const settings = this.getSettings;
    const extra: {pitch: number, rate: number, volume: number} = { } as {pitch: number, rate: number, volume: number};
    Object.assign(extra, settings ? settings.extra : {});

    if (choice === 0) {
      Object.assign(extra, {volume: this.altVolumeValue});
    }

    if (choice === 1) {
      Object.assign(extra, {pitch: this.pitchValue});
    }

    if (choice === 2) {
      Object.assign(extra, {rate: this.rateValue});
    }

    window.localStorage.setItem('settings', JSON.stringify(
      Object.assign(settings || {}, {extra})
    ));
  }

  public setVoice(index: number): void {
    const settings = this.getSettings;

    if (settings) {
      settings.voice = index;
      window.localStorage.setItem('settings', JSON.stringify(settings));
    } else {
      window.localStorage.setItem('settings', JSON.stringify({voice: index}));
    }
  }

  private getVoices(): void {
    this.voiceList = this.speech.getVoices();
  }

  public get getDefaultVoiceList(): number {
    return parseInt(this.getSettings && this.getSettings.voice ? this.getSettings.voice : '1', 10);
  }

  private get getSettings(): any {
    return JSON.parse(window.localStorage.getItem('settings'));
  }
}
