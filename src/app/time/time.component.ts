import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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
  public setTime: any;

  constructor(
    private _dialogRef: MatDialogRef<TimeComponent>
  ) { }

  ngOnInit() { }

  public onSubmit(time: any): void {
    this.setTime = time;
  }

  public onRevert(): void {
    this._dialogRef.close(this.setTime);
  }
}
