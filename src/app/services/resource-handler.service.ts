import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable, Subject } from 'rxjs';
import { SnackbarService } from './snackbar.service';

export interface BibleElement {
  version: string,
  verses: Array<any>,
  bookTitle: string,
  chapterNo: string
};

@Injectable({
  providedIn: 'root'
})
export class ResourceHandlerService {
  private resource: Subject<Array<BibleElement>> = new Subject();

  constructor(
    private electron: ElectronService,
    private snackbar: SnackbarService
  ) { }

  public fetchResource(): Observable<Array<BibleElement>> {
    // get set bible version
    let name: string;

    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.send('fetch-resource', {name: name || 'kjv'});
      this.electron.ipcRenderer.on('fetch-resource-complete', (e, data) => {
        this.resource.next(data.resource);
      });
    } else {
      this.snackbar.showSnackbar('[Error] Not an Electron App!', 'close', {duration: 7000});
      this.resource.next([] as Array<BibleElement>);
    }

    return this.resource;
  }
}
