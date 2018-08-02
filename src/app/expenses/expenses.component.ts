import { Component, OnInit } from '@angular/core';
import { Expense } from './expense';
import { expenseService } from '../services/expenses.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[];
  constructor(private expenseService: expenseService) { }

  ngOnInit() {
    this.expenses = this.expenseService.getAll();
    // Subscribe for updates
    this.expenseService.expensesChanged.subscribe(
      (expenses)=>{
        this.expenses = this.expenseService.getAll();
      }
    );
  }
}
