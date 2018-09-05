import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading:boolean;
  loading = new Subject();

  constructor() { }

  startLoading(){
    this.isLoading = true;
    this.newEvent();
  }

  finishLoading(){
    this.isLoading = false;
    this.newEvent();
  }

  private newEvent(){
    this.loading.next();
  }

}
