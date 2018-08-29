import { Injectable, EventEmitter, NgZone } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";

import { ErrorService } from "./error.service";
import { UserService } from "./user.service";

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
        
    constructor(
     private db: AngularFirestore,
     private errorService: ErrorService,
     private zone:NgZone
    ){
        this.vehiclesRef = this.db.collection('vehicles');
    }
    async get(data){
        if(data.id !== undefined){
            // Check if data exist on the service
            if(this.vehicles.length === 0){
                return await this.getOneFromDB(data.id);
            }else{
                // check if item exist on service
                let document = this.vehicles.filter(item=>data.id === item.id);
                if(document.length > 0){
                    return document[0];
                } else {
                    return await this.getOneFromDB(data.id);
                }
            }
        } else {
            if(this.vehicles.length === 0){
                if(!data.uid){
                    this.errorService.msg('user_no_id');
                    return [];
                }
                this.getAllFromDB(data.uid);
            } else {
                this.vehiclesChanged.emit(this.vehicles);
                return this.vehicles;
            }
        }
    }

    update(vehicle,cb){
        this.updateDB(vehicle,cb);
    }
    
    delete(id,cb){
        if(id !== undefined){
            this.deleteFromDB(id,cb);
        }
    }

    private getOneFromDB(id){
        return this.vehiclesRef.ref.doc(String(id)).get().then((item)=>{
            // if not found try to get item from DB 
            if(item.exists){
                // if found resolve with the item
                return {...item.data(), id: item.id};
            }else{
                // if not found reject and post error msg
                this.errorService.msg("vehicle_not_found");
                return {};
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

    private updateDB(vehicle, cb){
        let timestamp = Math.floor(Date.now() / 1000);
        vehicle.date = timestamp;
        this.vehiclesRef.doc(String(vehicle.id)).set(vehicle, {merge:true});
        // TODO: after update run cb
        if(typeof cb == "function"){
            cb();
        }
    }

    private deleteFromDB(id,cb){
        this.vehiclesRef.ref.doc(id).delete()
        .then(()=>{
            console.log("Document successfully deleted!");
            if(typeof cb == "function"){
                cb();
            }
        }).catch((error)=>{
            console.error("Error removing document: ", error);
        });
    }


}