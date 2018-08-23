import { Injectable, EventEmitter, NgZone } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";

import { ErrorService } from "./error.service";

@Injectable({
    providedIn: 'root'
})
export class VehiclesService {
    vehicle:Vehicle;
    vehicles:Array<Vehicle> = [];

    vehiclesRef;
    //handle vehicle select
    vehicleSelectedChanged = new EventEmitter();
    vehi
    vehiclesChanged = new EventEmitter();
    vehicleDocFetched = new EventEmitter<any>();
        
    constructor(
     private db: AngularFirestore,
     private errorService: ErrorService,
     private zone:NgZone
    ){
        this.vehiclesRef = this.db.collection('vehicles');
    }
    get(data){
        if(data.id !== undefined){
            // Check if data exist on the service
            if(this.vehicles.length === 0){
                this.getOneFromDB(data.id);
            }else{
                // check if item exist on service
                let document = this.vehicles.filter(item=>data.id === +item.id);
                document.length > 0 ? this.vehicleDocFetched.emit(document) : this.getOneFromDB(data.id);
            }
        } else {
            if(this.vehicles.length === 0){
                if(!data.uid){
                    this.errorService.msg('user_no_id');
                    return false;
                }
                this.getAllFromDB(data.uid);
            } else {
                this.vehiclesChanged.emit(this.vehicles);
            }
        }
    }

    update(vehicle,id){
        if(id === undefined){
            this.errorService.msg("vehicle_no_id");
            return false;
        }
        this.updateDB(vehicle);
    }
    
    delete(id){
        if(id !== undefined){
            this.deleteFromDB(id);
            return;
        }
    }

    private getOneFromDB(id){
        this.vehiclesRef.ref.doc(String(id)).onSnapshot((item)=>{
 
            // if not found try to get item from DB 
            if(item.exists){
                // if found resolve with the item
                let document = {...item.data(), id: item.id};
                 // zone.run make sure the emit event will run in angular zone and not inside the async DB call zone
                this.zone.run(()=>{
                    this.vehicleDocFetched.emit(document);
                });
            }else{
                // if not found reject and post error msg
                this.errorService.msg("vehicle_not_found");
            }

        });
    }

    private getAllFromDB(uid){
  
        let that = this;

        this.vehiclesRef.ref.where('uid', '==', uid).onSnapshot((list)=>{
            that.vehicles = [];
            list.forEach((item)=>{
                that.vehicles.push({...item.data(),id:item.id});
            });
            if(that.vehicles.length <= 0){
                this.errorService.msg("no_vehicles");
            }
            // zone.run make sure the emit event will run in angular zone and not inside the async DB call zone
            that.zone.run(()=>{
                that.vehiclesChanged.emit(that.vehicles);
            });
        });
    }

    private updateDB(vehicle){
        let timestamp = Math.floor(Date.now() / 1000);
        vehicle.date = timestamp;

        this.vehiclesRef.doc(String(vehicle.id)).set(vehicle);
    }

    private deleteFromDB(id){
        this.vehiclesRef.ref.doc(id).delete()
        .then(()=>{
            console.log("Document successfully deleted!")
        }).catch((error)=>{
            console.error("Error removing document: ", error);
        });
    }


}