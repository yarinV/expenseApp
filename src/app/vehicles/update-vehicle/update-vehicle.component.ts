import { Component, OnInit } from '@angular/core';

import { Location } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { VehiclesService } from '../../services/vehicles.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LogService } from '../../services/log.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-update-vehicle',
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.scss']
})
export class UpdateVehicleComponent implements OnInit {
  doc;

  constructor(private vehicleService: VehiclesService,
    private userService: UserService,
    private logService: LogService,
    private route:ActivatedRoute,
    private location: Location,
    private loaderService: LoaderService) {
    this.clearData();
  }

  ngOnInit() {
    this.loaderService.startLoading();
    let id = this.route.snapshot.paramMap.get('id') || undefined;
    if(id !== undefined){
      this.vehicleService.get({id}).then((item)=>{
        this.doc = item;
        this.loaderService.finishLoading();
      })
    } else {
      this.loaderService.finishLoading();
    }
  }

  submitForm(){
    if(this.doc.id === ""){
      this.doc.id = UUID.UUID();
    }
    if(this.userService.userData.uid === undefined){
      this.logService.msg('user_no_id');
      return false;
    }
    this.loaderService.startLoading();
    this.doc.uid = this.userService.userData.uid;
    this.vehicleService.update(this.doc, ()=>{
      // clear the data if not show individual expense
      if(this.route.snapshot.paramMap.get('id') !== undefined){
        this.clearData();
        this.location.back();
        this.loaderService.finishLoading();
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
