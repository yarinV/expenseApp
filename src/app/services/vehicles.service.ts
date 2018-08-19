import { Injectable, EventEmitter, NgZone } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";

import { ErrorService } from "./error.service";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class VehiclesService {
    vehicles;
    vehiclesRef
    //handle vehicle select
    vehicleSelectedChanged = new EventEmitter();

    vehiclesChanged = new EventEmitter();
    documentFetched = new EventEmitter<any>();
    userDataFetched = new EventEmitter<any>();
        
    constructor(private db: AngularFirestore,private errorService: ErrorService, public userService: UserService,private zone:NgZone ){
        this.vehiclesRef = this.db.collection('vehicles');
    }

    getFromFireStore(){
        let that = this;

        this.vehiclesRef.ref.where('uid', '==', this.userService.userData['uid']).onSnapshot((list)=>{
            that.vehicles = new Array<any>();
            list.forEach((item)=>{
                that.vehicles.push({...item.data(),id:item.id});
            });
            if(that.vehicles.length <= 0){
                this.errorService.msg("no_vehicles");
            }
            if(this.userService.userData.vehicleSelected === undefined){
                this.userService.getVehicleSelected().then(()=>{
                    that.zone.run(()=>{
                        that.vehiclesChanged.emit(that.vehicles)
                    });
                });
            }else{
                // zone.run make sure the emit event will run in angular zone and not inside the async DB call zone
                that.zone.run(()=>{
                    that.vehiclesChanged.emit(that.vehicles)
                });
            }
        });
    }

    getAll(){
        if(this.vehicles !== undefined){
            this.vehiclesChanged.emit(this.vehicles);
        } else {
            this.getFromFireStore();
        }
    }

    get(id){
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
                 // zone.run make sure the emit event will run in angular zone and not inside the async DB call zone
                this.zone.run(()=>{
                    this.documentFetched.emit(document);
                });
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