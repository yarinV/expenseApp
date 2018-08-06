import { Component, OnInit } from '@angular/core';

import { Expense } from './expense';
import { ExpenseService } from '../services/expenses.service';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  expenses:[any];
  vehicleId: number;
  showError;

  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {
    var that = this;
    
    // Subscribe for updates
    this.expenseService.expensesChanged.subscribe(
      (data)=>{
        that.expenses = data;
      }
    );

    this.getExpenses();
  }

  getExpenses(){
   
    if(this.expenseService.expenses === undefined){
      this.expenseService.getFromFireStore();
    }else{
      this.expenses = this.expenseService.expenses;
    }
  }
}
