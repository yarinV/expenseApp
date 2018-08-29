import { Component, OnInit } from '@angular/core';

import { Location } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { VehiclesService } from '../../services/vehicles.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-update-vehicle',
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.scss']
})
export class UpdateVehicleComponent implements OnInit {
  doc;

  constructor(private vehicleService: VehiclesService,
    private userService: UserService,
    private errorService: ErrorService,
    private route:ActivatedRoute,
    private location: Location) {
    this.clearData();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id') || undefined;
    if(id !== undefined){
      this.vehicleService.get({id}).then((item)=>{
        this.doc = item;
      })
    }
  }

  submitForm(){
    if(this.doc.id === ""){
      this.doc.id = UUID.UUID();
    }
    if(this.userService.userData.uid === undefined){
      this.errorService.msg('user_no_id');
      return false;
    }
    this.doc.uid = this.userService.userData.uid;
    this.vehicleService.update( this.doc, ()=>{
      // clear the data if not show individual expense
      if(this.route.snapshot.paramMap.get('id') !== undefined){
        this.clearData();
        this.location.back();
      }
    });
  }

  delete(id){
    // Delete and go back
    this.vehicleService.delete(id,()=>{
      this.location.back();
    });
  }
  
  clearData(){
    this.doc = {
      name:"",
      id:"",
      uid:""
    }
  }

}
