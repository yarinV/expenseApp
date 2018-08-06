import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Expense } from '../expense';
import { ExpenseService } from '../../services/expenses.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  item;
  constructor(private route:ActivatedRoute, private expenseService:ExpenseService, private location:Location) { }

  ngOnInit() {
    this.getExpense();
  }

  getExpense(){
    let that = this;
    const id = +this.route.snapshot.paramMap.get('id');
    this.expenseService.get(id);

    this.expenseService.documentFetched.subscribe((document)=>{
      that.item = document;
    });
  }

  goBack(): void{
    this.location.back();
  }

}
