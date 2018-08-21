import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'view-button',
  templateUrl: './view-button.component.html',
  styleUrls: ['./view-button.component.css']
})
export class ViewButtonComponent implements OnInit {
  @Input('id') id;
  constructor() { }

  ngOnInit() {
  }

}
