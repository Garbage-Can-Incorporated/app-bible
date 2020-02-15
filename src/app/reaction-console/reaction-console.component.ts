import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-reaction-console',
  templateUrl: './reaction-console.component.html',
  styleUrls: ['./reaction-console.component.css']
})
export class ReactionConsoleComponent implements OnInit {
  @Input() passages: string;
  public playerState: boolean = <boolean>false;

  public show = <boolean> false;

  constructor(
    private _player: PlayerService
  ) { }

  ngOnInit() { }

  public toggleIconsVisibility(): void {
    this.show = !this.show;
  }

  public likeVerse(el: Element): void {
    if (el.classList.contains('far')) {
      el.classList.replace('far', 'fa');
      el.classList.add('__red--color');
      return;
    }

    if (el.classList.contains('fa')) {
      el.classList.replace('fa', 'far');
      el.classList.remove('__red--color');
      return;
    }
  }

  public readVerse(playIcon: Element): void {
    console.log(this.playerState);
    // this.playerState = true;
    this.toggleVersePlay(playIcon, this.passages);
  }

  private toggleVersePlay(icon: Element, content: string): void {
    if (icon.classList.contains('fa-pause')) {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');

      icon.classList.remove('__blue--color');

      this._player.pause();
    } else {
      this.playerState = true;

      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');

      icon.classList.add('__blue--color');

      this._player.play(content)
        .subscribe(
          (data) => console.log(data),
          (error) => {
            console.log(error);
            this.stopPlay();
            icon.classList.replace('fa-pause', 'fa-play');
            icon.classList.remove('__blue--color');

            this.playerState = false;
          },
          () => {
            console.log('complete!');
            icon.classList.replace('fa-pause', 'fa-play');
            icon.classList.remove('__blue--color');

            this.playerState = false;
          }
        );
    }
  }

  public stopPlay(): void {
    this._player.stop();
    this.togglePlayerState();
  }

  public togglePlayerState(): void {
    this.playerState = !this.playerState;
  }
}
