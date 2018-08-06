import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  error;
  constructor(private errorService: ErrorService) {}

  ngOnInit(){
    this.errorService.newError.subscribe(
      error => this.error = error
    );
  }
}
