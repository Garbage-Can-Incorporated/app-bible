import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private config: any = {
    verticalPosition: 'bottom',
    horizontalPosition: 'right',
    // panelClass: '__mx-vw-33'
  };

  constructor(
    private _snackbar: MatSnackBar
  ) { }

  public showSnackbarFromComponent(): void {
    // this._snackbar.openFromComponent();
  }

  public showSnackbar(data: string, action = 'close', config = this.config): void {
    this._snackbar.open(
      data, action,
      config
    );
  }
}
