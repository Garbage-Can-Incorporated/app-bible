import { Component, OnInit } from '@angular/core';

import { DialogService } from '../services/dialog.service';

import { TimeComponent } from '../time/time.component';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {

  constructor(
    private _dialog: DialogService
  ) { }

  ngOnInit() { }

  public openAddDialog(): void {
    const dialog = this._dialog
      .openDialog(
        {},
        TimeComponent,
        { height: 'fit-content', disableClose: true }
      );

    dialog.afterClosed()
      .subscribe(
        (data) => {
          console.log({ data });
        }
      );
  }
}
