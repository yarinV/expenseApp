import { Injectable, EventEmitter, NgZone } from "@angular/core";
import { AngularFirestore } from 'angularfire2/firestore';

import { Expense } from "../expenses/expense";
import { VehiclesService } from "./vehicles.service";
import { LogService } from "./log.service";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    expenses;
    expenseRef;

    expensesChanged = new EventEmitter();
    expenseDocFetched = new EventEmitter<any>();

    constructor(
        private db: AngularFirestore,
        private vehiclesService:VehiclesService,
        private userService:UserService,
        private logService: LogService,
        ){
            // Vehicle changed get the expenses
            this.vehiclesService.vehicleSelectedChanged.subscribe(
                ()=>{
                    this.getAllFromDbAsync({updateLocal:true}, ()=>{
                        this.expensesChanged.emit()
                    });
                    this.logService.clear();
                }
            )
            
            this.expenseRef = this.db.collection('expenses');
    }

    async get(id?){
        if(id !== undefined){
            // get one document
            if(this.expenses === undefined){
                return this.getOneFromDBAsync(id);
            } else {
                let doc = this.expenses.filter( item => id === +item.id);
                return doc.length > 0 ? doc[0] : this.getOneFromDBAsync(id);
            }
        } else {
            // get all documents
            if(this.expenses === undefined){
                return this.getAllFromDbAsync({updateLocal:true});
            } else {
                return this.expenses.length > 0 ? this.expenses : this.getAllFromDbAsync({updateLocal:true});
            }
        }
    }

    update(expense, cb){
        this.updateDB(expense, cb);
    }

    delete(id, cb){
        if(id !== undefined){
            this.deleteFromDB(id, cb);
            return;
        }
    }

    getOneFromDBAsync(id){
        return this.expenseRef.ref.doc(String(id)).get().then((item)=>{
            // if not found try to get item from DB 
            if(item.exists){
                // if found resolve with the item
                return {...item.data(), id: item.id};
            }else{
                // if not found reject and post error msg
                this.logService.msg("expense_not_found");
                return {};
            }
        });
    }

    async getAllFromDbAsync(data, cb?){
        if(!data.vehicle){
            let temp;
            await this.checkVehicleSelected().then((item)=>{ temp = item;})
            data.vehicle = temp;
        }

        return this.expenseRef.ref.where('vehicleId', '==', data.vehicle).get().then((list)=>{
            let expenses = [];
            list.forEach((item)=>{
                expenses.push({...item.data(),id:item.id});
            });
            if(expenses.length <= 0){
                this.logService.msg("no_expenses");
            }else{
                this.logService.clear();
            }
            // return empty or list with data
            if(data.updateLocal){
                this.expenses = expenses;
            }
            if(typeof cb === "function"){
                cb();
            }
            return expenses;
        });
    }

    updateDB(expense, cb){
        
        this.checkVehicleSelected(true).then((results)=>{
            let vehicleSelected = results;
            let timestamp = Math.floor(Date.now());
        
            if(vehicleSelected == '' && expense.vehicleId === undefined){
                return false;
            }

            if(expense.id === undefined){
                this.logService.msg("expense_no_id");
                return false;
            }else{
                this.logService.clear();
            }

            expense.date = expense.date || timestamp;
            expense.vehicleId = vehicleSelected;
            
            this.expenseRef.doc(String(expense.id)).set(expense).then(()=>{
                if(typeof cb == "function"){
                    cb();
                }
                
                this.logService.msg('expense_updated');
            }).catch((error)=>{
                this.logService.msg('expense_not_updated');
                this.logService.msg(error);
            });
            
        });
    }

    deleteFromDB(id, cb){
        this.expenseRef.ref.doc(id).delete()
        .then(()=>{
            this.logService.msg('expense_deleted');
            if(typeof cb == "function"){
                cb();
            }
        }).catch((error)=>{
            this.logService.msg('expense_not_deleted');
            this.logService.msg(error);
        });
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
                    this.logService.msg("vehicle_select");
                } 
            }
            return newVehicleSelected;            
        }
    }

    async calculateTotal(vehicles){
        let total = [];
        for (let i = 0; i < vehicles.length; i++) {
            const item = vehicles[i];
            await this.getAllFromDbAsync({vehicle:item.id}).then((expenses)=>{
                total[item.id] = 0;
                expenses.forEach((expense)=>{
                    total[item.id] += +expense.sum;
                });
            })
        }
        return total;
    }
}