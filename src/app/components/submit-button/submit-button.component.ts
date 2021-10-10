import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss']
})
export class SubmitButtonComponent implements OnInit {
  @Input() text;
  constructor() { }

  ngOnInit() {
  }

}
