import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private config: any = {
    verticalPosition: 'bottom',
    horizontalPosition: 'right',
    panelClass: '__mx-vw-33'
  };

  constructor(
    private _snackbar: MatSnackBar
  ) { }

  public showSnackBarFromComponent(): void {
    // this._snackbar.openFromComponent();
  }

  public showSnackBar(data: string, action = 'close', config = this.config): void {
    this._snackbar.open(
      data, action,
      config
    );
  }
}
