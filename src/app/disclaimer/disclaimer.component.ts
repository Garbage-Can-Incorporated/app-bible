import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ewd-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {
  public disclaimerTexts: {heading: string; contents: string[]}[] = [
    {
      heading: 'Scripture Player',
      contents: [
        'The Scripture Player is powered by SpeechSynthesis, an experimental technology. You might experience some inconveniences. Please, bear with us.',
        // tslint:disable-next-line: max-line-length
        'Plans are being made to replace SpeechSynthesis with Google\'s Text-To-Speech which comes at a cost, and subsequently a trained model (WaveNet).',
        'Thank you.',
      ]
    }
  ];

  constructor(private dialogRef: MatDialogRef<DisclaimerComponent>) { }

  ngOnInit(): void {
    this.dialogRef.addPanelClass('ewd-general_dialog');
  }
}
