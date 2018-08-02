import { Component, OnInit } from '@angular/core';
import { Expense } from '../expense';
import { expenseService } from '../../services/expenses.service';

import {UUID} from "angular2-uuid";

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class addExpenseComponent implements OnInit {
  expense = new Expense;
  
  constructor(private expenseService: expenseService) {
  }
  
  ngOnInit() {
    
  }

  submitForm(){
    this.expense.id = UUID.UUID();
    this.expense.date = Math.floor(Date.now() / 1000);
    let that = this;
    this.expenseService.add(this.expense).then(
      ()=>{
        this.expense = new Expense;
      }
    ).catch( error=> console.log(error) );
  }

}
