import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading: boolean;
  changes = new EventEmitter();

  constructor() { }

  startLoading() {
    setTimeout( () => {
      this.isLoading = true;
      this.changes.emit(this.isLoading);
    }, 0);
  }

  finishLoading() {
    setTimeout( () => {
      this.isLoading = false;
      this.changes.emit(this.isLoading);
    }, 0);
  }

}
