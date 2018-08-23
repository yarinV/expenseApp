import { Component, OnInit } from '@angular/core';

import { UUID } from 'angular2-uuid';
import { VehiclesService } from '../../services/vehicles.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-vehicle',
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.css']
})
export class UpdateVehicleComponent implements OnInit {
  doc;

  constructor(private vehicleService: VehiclesService, private route:ActivatedRoute) {
    this.clearData();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id') || undefined;
    if(id !== undefined){
      this.vehicleService.get({id});

      this.vehicleService.vehicleDocFetched.subscribe((document)=>{
        this.doc = document;
      });      
    }
  }

  submitForm(){
    if(this.doc.id === ""){
      this.doc.id = UUID.UUID();
    }
    
    this.vehicleService.update( this.doc, ()=>{
      // clear the data if not show individual expense
      if(this.route.snapshot.paramMap.get('id') !== undefined){
        this.clearData();
      }
    });
  }
  
  clearData(){
    this.doc = {
      name:"",
      sum:"",
      odometer:"",
      date:"",
      id:""
    }
  }
}
