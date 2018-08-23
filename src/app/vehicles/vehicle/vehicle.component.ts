import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  @Input('doc') doc; 
  constructor() { }

  ngOnInit() {
  }

}
