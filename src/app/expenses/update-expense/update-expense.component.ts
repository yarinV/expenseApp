import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExpenseService } from '../../services/expenses.service';
import { Expense } from '../expense';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-update-expense',
  templateUrl: './update-expense.component.html',
  styleUrls: ['./update-expense.component.scss']
})
export class UpdateExpenseComponent implements OnInit {
  doc;

  constructor(private expenseService: ExpenseService,
    private route:ActivatedRoute,
    private location: Location) {
    this.clearData();
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id') || undefined;
    if(id !== undefined){
      this.expenseService.get(id).then((document)=>{
        this.doc = document
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
        this.location.back();
      }
    });
  }

  delete(id){
    // Delete and go back
    this.expenseService.delete(id,()=>{
      this.location.back();
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
