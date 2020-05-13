import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.css']
})
export class MoreComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<MoreComponent>
  ) { }

  ngOnInit() {
    this.dialogRef.addPanelClass('__app-dialog--default__background');
  }
}
