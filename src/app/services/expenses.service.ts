import { Injectable, EventEmitter } from "@angular/core";
import { AngularFirestore } from 'angularfire2/firestore';

import { Expense } from "../expenses/expense";
import { VehiclesService } from "./vehicles.service";
import { ErrorService } from "./error.service";

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
        private errorService: ErrorService ){
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
        let vehicleSelected = this.checkVehicleSelected();
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
            that.expensesChanged.emit(that.expenses);
        });
       
    }

    getAll(){
        if(this.expenses !== undefined){
            return this.expenses;
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
                    this.documentFetched.emit(document);
                }else{
                    // if not found reject and post error msg
                    this.errorService.msg("expense_not_found")
                }

            });
    }

    addOrUpdate(expense, id){
        
        let vehicleSelected:string = this.checkVehicleSelected(true);
        if(vehicleSelected === '' && expense.vehicleId === undefined){
            return false;
        }

        if(id === undefined){
            this.errorService.msg("expense_no_id");
            return false;
        }

        let timestamp = Math.floor(Date.now() / 1000);
        expense.date = timestamp;
        expense.vehicleId = vehicleSelected;
        
        this.expenseRef.doc(String(id)).set(expense);
    }

    checkVehicleSelected(showError?){
        let vehicleSelected:string = this.vehiclesService.vehicleSelected;
        if(vehicleSelected === undefined){
            if(showError){
                this.errorService.msg("vehicle_select");
            }
            return '';
        }
        return vehicleSelected;
    }

}