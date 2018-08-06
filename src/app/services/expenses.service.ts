import { Injectable, EventEmitter } from "@angular/core";
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Expense } from "../expenses/expense";
import { VehiclesService } from "./vehicles.service";
import { ErrorService } from "./error.service";
import { resolve } from "dns";

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    expenses;
    expenseRef;
    expensesChanged = new EventEmitter<Expense[]>();
    documentFetched = new EventEmitter<any>();

    constructor(
        public afAuth: AngularFireAuth,
        private db: AngularFirestore,
        private vehiclesService:VehiclesService,
        private errorService: ErrorService ){
            
            this.afAuth.auth.signInAnonymously();
            
            // Vehicle changed get the expenses
            this.vehiclesService.vehicleChanged.subscribe(
                ()=>{
                    this.getFromFireStore();
                }
            )
            
            this.expenseRef = this.db.collection('expenses');
    }

    getFromFireStore(){

        let that = this;
        let vehicleSelected = this.checkVehicleSelected();
        if(!vehicleSelected){
            return false;
        }
        
        // subscribe        
        this.db.collection('expenses').ref.where('vehicleId', '==', +vehicleSelected).onSnapshot((list)=>{
            that.expenses = new Array<any>();
            list.forEach((item)=>{
                that.expenses.push({...item.data(),id:item.id});
            });
            that.expensesChanged.emit(that.expenses);
        });
       
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
            this.db.collection('expenses').ref.doc(String(doc)).onSnapshot((item)=>{
     
                // if not found try to get item from DB 
                if(item.exists){
                    // if found resolve with the item
                    let document = {...item.data(), id: item.id};
                    this.documentFetched.emit(document);
                }else{
                    // if not found reject and post error msg
                    this.errorService.msg("Expense not found")
                }

            });
    }

    add(expense, id){
        
        let vehicleSelected:number = this.checkVehicleSelected(false);
        if(vehicleSelected === 0 && expense.vehicleId === undefined){
            return false;
        }

        if(id === undefined){
            this.errorService.msg("Expense ID not set");
            return false;
        }

        let timestamp = Math.floor(Date.now() / 1000);
        expense.date = timestamp;
        expense.vehicleId = vehicleSelected;
        
        this.expenseRef.doc(String(id)).set(expense);
    }

    checkVehicleSelected(showError?){
        let vehicleSelected:number = this.vehiclesService.vehicleSelected;
        if(vehicleSelected === undefined){
            if(showError){
                this.errorService.msg("Please Select Vehicle");
            }
            return 0;
        }
        return vehicleSelected;
    }

}