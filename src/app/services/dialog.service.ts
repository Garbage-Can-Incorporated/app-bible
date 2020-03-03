import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DialogConfig } from '../interfaces/dialog-config';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private dialog: MatDialog
  ) { }

  public openDialog(
    data: any,
    comp,
    {
      hasBackdrop = true,
      height = '80%',
      minHeight = 'fit-content',
      maxHeight = '80%',
      width = '350px',
      minWidth = '320px',
      maxWidth = 'fit-content'
    }
  ): MatDialogRef<any, any> {
    const config: DialogConfig = {
      data,
      hasBackdrop,
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth
    };

    const dialogRef: MatDialogRef<any, any> = this
      .dialog
      .open(
        comp,
        config
      );

    return dialogRef;
  }

  public closeDialog(comp) {

  }
}
