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
    expenseDocFetched = new EventEmitter<any>();

    constructor(
        private db: AngularFirestore,
        private vehiclesService:VehiclesService,
        private userService:UserService,
        private errorService: ErrorService,
        private zone:NgZone ){
            // Vehicle changed get the expenses
            this.vehiclesService.vehicleSelectedChanged.subscribe(
                ()=>{
                    this.getAllFromDbAsync({updateLocal:true});
                    this.errorService.clear();
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

    // getOneFromDB(id){
    //     return this.expenseRef.ref.doc(String(id)).onSnapshot((item)=>{
    
    //         // if not found try to get item from DB 
    //         if(item.exists){
    //             // if found resolve with the item
    //             return {...item.data(), id: item.id};
    //         }else{
    //             // if not found reject and post error msg
    //             this.errorService.msg("expense_not_found");
    //             return {};
    //         }

    //     });
    // }

    async getOneFromDBAsync(id){
        return this.expenseRef.ref.doc(String(id)).onSnapshot((item)=>{
            // if not found try to get item from DB 
            if(item.exists){
                // if found resolve with the item
                let document = {...item.data(), id: item.id};
                return this.expenseDocFetched.emit(document);
            }else{
                // if not found reject and post error msg
                this.errorService.msg("expense_not_found");
                return {};
            }
        });
    }

    // getAllFromDB(){

    //     this.checkVehicleSelected().then((data)=>{
    //         let vehicleSelected = data;
        
    //         if(vehicleSelected === ''){
    //             return false;
    //         }
            
    //         this.expenseRef.ref.where('vehicleId', '==', vehicleSelected).onSnapshot((list)=>{
    //             this.expenses = new Array<any>();
    //             list.forEach((item)=>{
    //                 this.expenses.push({...item.data(),id:item.id});
    //             });
    //             if(this.expenses.length <= 0){
    //                 this.errorService.msg("no_expenses");
    //                 return false;
    //             }else{
    //                 this.errorService.clear();
    //             }
    //             // return empty or list with data
    //             // zone.run make sure the emit event will run in angular zone and not inside the async DB call zone
    //             this.zone.run(()=>{
    //                 this.expensesChanged.emit(this.expenses);
    //             });
                
    //         });

    //     });
       
    // }

    async getAllFromDbAsync(data){
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
                this.errorService.msg("no_expenses");
            }else{
                this.errorService.clear();
            }
            // return empty or list with data
            if(data.updateLocal){
                this.expenses = expenses;
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
                this.errorService.msg("expense_no_id");
                return false;
            }else{
                this.errorService.clear();
            }

            expense.date = expense.date || timestamp;
            expense.vehicleId = vehicleSelected;
            
            this.expenseRef.doc(String(expense.id)).set(expense);
            // TODO: after update run cb
            if(typeof cb == "function"){
                cb();
            }
        });
    }

    deleteFromDB(id, cb){
        this.expenseRef.ref.doc(id).delete()
        .then(()=>{
            console.log("Document successfully deleted!");
            if(typeof cb == "function"){
                cb();
            }
        }).catch((error)=>{
            console.error("Error removing document: ", error);
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
                    this.errorService.msg("vehicle_select");
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