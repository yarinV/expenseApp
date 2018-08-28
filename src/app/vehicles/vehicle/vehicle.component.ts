import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  @Input('doc') doc; 
  constructor() { }

  ngOnInit() {
  }

}
