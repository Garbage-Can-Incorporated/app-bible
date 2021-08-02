import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';

@Component({
  selector: 'ewd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    let disclaimer: MatDialogRef<DisclaimerComponent>;
    const disclaimerDialogStatus = JSON.parse(window.localStorage.getItem('dds'));

    if (disclaimerDialogStatus === false) {
      disclaimer = this.dialog.open(DisclaimerComponent, {
        width: 'fit-content',
        height: 'fit-content',
        maxWidth: 'fit-content',
        maxHeight: 'fit-content',
        disableClose: true,
      });

      disclaimer.afterClosed()
        .subscribe(() => {
          window.localStorage.setItem('dds', (true).toString());
        });
    }

    if (disclaimerDialogStatus === null) {
      window.localStorage.setItem('dds', (false).toString());
    }
  }

  public onActivated(e): void {
    console.log({e});
  }

  public onDeactivated(e): void {
    console.log({e});
  }
}
