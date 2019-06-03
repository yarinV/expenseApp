import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  value: boolean;
  constructor(public loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.changes.subscribe( change => {
      this.value = change;
    });
  }

  isLoading() {
    return this.loaderService.isLoading;
  }
}
