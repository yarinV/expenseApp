import { Component, OnInit, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

import { ExpenseService } from '../services/expenses.service';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  expenses:[any];
  vehicleId: number;
  speed_unit = environment.speed_unit;
  
  constructor(private expenseService: ExpenseService, private zone:NgZone) { }

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
    this.expenseService.getAll();
  }

}
