import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {
  @Input('link') link;
  constructor() { }

  ngOnInit() {
  }

}
