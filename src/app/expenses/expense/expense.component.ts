import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Expense } from '../expense';
import { expenseService } from '../../services/expenses.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  item:Expense;
  constructor(private route:ActivatedRoute, private expenseService:expenseService, private location:Location) { }

  ngOnInit() {
    this.getExpense();
  }

  getExpense(){
    const id = +this.route.snapshot.paramMap.get('id');
    this.item = this.expenseService.get(id);
  }

  goBack(): void{
    this.location.back();
  }

}
