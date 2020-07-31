import {Component, OnInit} from '@angular/core';

import {SpeechSynthesisService} from '../services/speech-synthesis.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public voiceList: Array<SpeechSynthesisVoice> = [];
  public voiceIndex: number;

  constructor(private speech: SpeechSynthesisService) { }

  ngOnInit() {
    this.getVoices();
    this.voiceIndex = this.getDefaultVoiceList;
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
    return parseInt(this.getSettings ? this.getSettings.voice : '0', 10);
  }

  private get getSettings(): any {
    return JSON.parse(window.localStorage.getItem('settings'));
  }
}
