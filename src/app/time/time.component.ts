import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  public _defaultTime: any = {
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    format: 24 // user decide format, add to setting
  };

  public defaultTime: any = { ...this._defaultTime };

  constructor(
    private dialogRef: MatDialogRef<TimeComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) { }

  ngOnInit() {
    this.dialogRef.addPanelClass('__app-dialog--default__background');

    if (
      this.data.hasOwnProperty('hour') &&
      this.data.hasOwnProperty('minute')
    ) {
      this.defaultTime.hour = this.data.hour;
      this.defaultTime.minute = this.data.minute;
    }
  }

  public onSubmit(time: any): void {
    this.dialogRef.close(time);
  }

  public onRevert(): void {
    this.dialogRef.close();
  }
}
