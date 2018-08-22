import { Injectable, EventEmitter, NgZone } from "@angular/core";
import { AngularFirestore } from 'angularfire2/firestore';

import { Expense } from "../expenses/expense";
import { VehiclesService } from "./vehicles.service";
import { ErrorService } from "./error.service";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    expenses;
    expenseRef;

    expensesChanged = new EventEmitter<Expense[]>();
    documentFetched = new EventEmitter<any>();

    constructor(
        private db: AngularFirestore,
        private vehiclesService:VehiclesService,
        private userService:UserService,
        private errorService: ErrorService,
        private zone:NgZone ){
            // Vehicle changed get the expenses
            this.vehiclesService.vehicleSelectedChanged.subscribe(
                ()=>{
                    this.getFromFireStore();
                    this.errorService.clear();
                }
            )
            
            this.expenseRef = this.db.collection('expenses');
    }

    getFromFireStore(){

        let that = this;
        this.checkVehicleSelected().then((data)=>{
            let vehicleSelected = data;
        
            if(vehicleSelected === ''){
                return false;
            }
            
            this.expenseRef.ref.where('vehicleId', '==', vehicleSelected).onSnapshot((list)=>{
                that.expenses = new Array<any>();
                list.forEach((item)=>{
                    that.expenses.push({...item.data(),id:item.id});
                });
                if(that.expenses.length <= 0){
                    this.errorService.msg("no_expenses");
                } 
                // return empty or list with data
                // zone.run make sure the emit event will run in angular zone and not inside the async DB call zone
                that.zone.run(()=>{
                    that.expensesChanged.emit(that.expenses);
                });
                
            });

        });
       
    }

    getAll(){
        if(this.expenses !== undefined){
            this.expensesChanged.emit(this.expenses);
        } else {
            this.getFromFireStore();
        }
    }

    get(id){
        // Check if data exist on the service
        if(this.expenses != undefined){
            // check if item exist on service
            let document = this.expenses.filter((item)=>{
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
             this.expenseRef.ref.doc(String(doc)).onSnapshot((item)=>{
     
                // if not found try to get item from DB 
                if(item.exists){
                    // if found resolve with the item
                    let document = {...item.data(), id: item.id};
                    // zone.run make sure the emit event will run in angular zone and not inside the async DB call zone
                    this.zone.run(()=>{
                        this.documentFetched.emit(document);
                    })
                }else{
                    // if not found reject and post error msg
                    this.errorService.msg("expense_not_found")
                }

            });
    }

    addOrUpdate(expense, id, cb){
        
        this.checkVehicleSelected(true).then((data)=>{
            let vehicleSelected = data;
            let timestamp = Math.floor(Date.now());
        
            if(vehicleSelected == '' && expense.vehicleId === undefined){
                return false;
            }

            if(id === undefined){
                this.errorService.msg("expense_no_id");
                return false;
            }

            expense.date = expense.date || timestamp;
            expense.vehicleId = vehicleSelected;
            
            this.expenseRef.doc(String(id)).set(expense);
            if(typeof cb == "function"){
                cb();
            }
        });
    }

    delete(id){
        this.expenseRef.ref.doc(id).delete()
        .then(()=>{
            console.log("Document successfully deleted!")
        }).catch((error)=>{
            console.error("Error removing document: ", error);
        })
    }
    
    async checkVehicleSelected(showError?){
        let vehicleSelected:string = this.userService.userData.vehicleSelected;
        if(vehicleSelected != undefined){
            return vehicleSelected;
        } else {
            // Get user selected vehicle from DB
            let newVehicleSelected = await this.userService.getVehicleSelected(false);
            if(newVehicleSelected === ''){
                if(showError){
                    this.errorService.msg("vehicle_select");
                } 
            }
            return newVehicleSelected;            
        }
    }

}