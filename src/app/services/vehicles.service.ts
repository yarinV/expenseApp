import { Injectable, EventEmitter } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";

import { ErrorService } from "./error.service";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class VehiclesService {
    vehicles;
    vehiclesRef
    //handle vehicle select
    vehicleSelected: string;
    vehicleSelectedChanged = new EventEmitter();

    vehiclesChanged = new EventEmitter();
    documentFetched = new EventEmitter<any>();
    userDataFetched = new EventEmitter<any>();
        
    constructor(private db: AngularFirestore,private errorService: ErrorService, public auth: AuthService ){
        this.vehiclesRef = this.db.collection('vehicles');
    }

    getFromFireStore(){
        let that = this;

        this.vehiclesRef.ref.where('uid', '==', this.auth.userData['uid']).onSnapshot((list)=>{
            that.vehicles = new Array<any>();
            list.forEach((item)=>{
                that.vehicles.push({...item.data(),id:item.id});
            });
            if(that.vehicles.length <= 0){
                this.errorService.msg("no_vehicles");
            }
            that.vehiclesChanged.emit(that.vehicles);
            that.vehicleSelected = this.auth.userData['vehicleSelected'];
        });
    }

    getAll(){
        if(this.vehicles !== undefined){
            return this.vehicles;
        } else {
            this.getFromFireStore();
        }
    }

    get(id){
        debugger;
        // Check if data exist on the service
        if(this.vehicles != undefined){
            // check if item exist on service
            let document = this.vehicles.filter((item)=>{
                return id === +item.id;
            })
            if(document.length < 0){
                // if found return item
                this.documentFetched.emit(document);
            }else{
                this.getDocFromFirebase(id);
            }
        }else{
            this.getDocFromFirebase(id);
        }
    }

    getDocFromFirebase(doc){
        this.vehiclesRef.ref.doc(String(doc)).onSnapshot((item)=>{
 
            // if not found try to get item from DB 
            if(item.exists){
                // if found resolve with the item
                let document = {...item.data(), id: item.id};
                this.documentFetched.emit(document);
            }else{
                // if not found reject and post error msg
                this.errorService.msg("vehicle_not_found");
            }

        });
    }

    addOrUpdate(vehicle,id){
        if(id === undefined){
            this.errorService.msg("vehicle_no_id");
            return false;
        }

        let timestamp = Math.floor(Date.now() / 1000);
        vehicle.date = timestamp;
        vehicle.id = timestamp;

        this.vehiclesRef.doc(String(id)).set(vehicle);
    }
}