import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ExpenseService } from '../../services/expenses.service';
import { Expense } from '../expense';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class addExpenseComponent implements OnInit {
  expense;
  id;

  constructor(private expenseService: ExpenseService, private route:ActivatedRoute, private location:Location) {
    this.clearData();
  }

  ngOnInit() {
    let that = this;
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if(this.id !== undefined){
      this.expenseService.get(this.id);

      this.expenseService.documentFetched.subscribe((document)=>{
        that.expense = document;
      });      
    }
  }

  submitForm(){
    if(this.id === undefined){
      this.id = UUID.UUID();
    }

    this.expenseService.addOrUpdate(this.expense, this.id, ()=>{
      // clear the data if not show individual expense
      if(this.route.snapshot.paramMap.get('id') !== undefined){
        this.clearData();
      }
    });
  }

  delete(id){
    this.expenseService.delete(id);
  }
  
  clearData(){
    this.expense = {
      name:"",
      sum:"",
      odometer:"",
      date:""
    }
    this.id = undefined;
  }
}
