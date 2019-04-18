import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading:boolean;

  constructor() { }

  startLoading(){
    setTimeout(() => {
      this.isLoading = true;
    });
  }

  finishLoading(){
    setTimeout(() => {
      this.isLoading = false;
    });
  }

}
