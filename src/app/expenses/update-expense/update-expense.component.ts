import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExpenseService } from '../../services/expenses.service';
import { Expense } from '../expense';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-update-expense',
  templateUrl: './update-expense.component.html',
  styleUrls: ['./update-expense.component.css']
})
export class updateExpenseComponent implements OnInit {
  doc;

  constructor(private expenseService: ExpenseService, private route:ActivatedRoute) {
    this.clearData();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id') || undefined;
    if(id !== undefined){
      this.expenseService.get(id);

      this.expenseService.expenseDocFetched.subscribe((document)=>{
        this.doc = document;
      });      
    }
  }

  submitForm(){
    if(this.doc.id === ""){
      this.doc.id = UUID.UUID();
    }
    
    this.expenseService.update( this.doc, ()=>{
      // clear the data if not show individual expense
      if(this.route.snapshot.paramMap.get('id') !== undefined){
        this.clearData();
      }
    });
  }
  
  clearData(){
    this.doc = {
      name:"",
      sum:"",
      odometer:"",
      date:"",
      id:""
    }
  }
}
