import { Component, OnInit } from '@angular/core';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  error;
  constructor(private logService: LogService) {}

  ngOnInit(){
    this.logService.newMsg.subscribe(
      error => this.error = error
    );
  }
}
