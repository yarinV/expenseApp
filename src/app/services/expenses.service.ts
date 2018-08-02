import { Injectable, EventEmitter } from "@angular/core";

import { Expense } from "../expenses/expense";
import { mockExpenses } from "../expenses/expenses-mock";

@Injectable({
    providedIn: 'root'
})
export class expenseService {
    expenses:Expense[];
    expensesChanged = new EventEmitter<Expense[]>();

    constructor(){
        this.expenses = mockExpenses;
    }

    getAll(){
        // Return a new copy of the array
        return this.expenses.slice();
    }

    get(id){
        return this.expenses.find(
            (item)=>{
                return +item.id === id;
            }
        );
    }

    add(expense:Expense){
        return new Promise(
            (resolve,reject)=>{
                let length = mockExpenses.length;
                mockExpenses.push(expense);
                if(length < mockExpenses.length){
                    this.expensesChanged.emit();
                    resolve();
                }else{
                    reject("error");
                }
            }
        );
    }

    edit(expense:Expense){
        mockExpenses.filter((item, index)=>{
            if(item.id === expense.id){
                mockExpenses[index] = {...expense};
                this.expensesChanged.emit();
            }
        });
    }
}