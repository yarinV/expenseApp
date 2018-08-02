import { Injectable } from "@angular/core";
import { Vehicle } from "../vehicles/vehicles";
import { mockVehicles } from "../vehicles/vehicles-mock";
import {UUID} from "angular2-uuid";

@Injectable({
    providedIn: 'root'
})
export class VehiclesService {
    vehicles: Vehicle[];
    constructor(){}

    get(){
        this.vehicles = mockVehicles;
        return this.vehicles;
    }

    add(name:string){
        let vehicle = {
            id: UUID.UUID(),
            name: name,
        }
        mockVehicles.push(vehicle);
    }

    edit(id:string, name:string){
        mockVehicles.filter((item)=>{
            if(item.id === id){
                item.name = name;
            }
        });
    }
}