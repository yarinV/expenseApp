import { Component, OnInit, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

import { ExpenseService } from '../services/expenses.service';
import { UserService } from '../services/user.service';
import { ErrorService } from '../services/error.service';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses:[any];
  vehicleId: number;
  speed_unit = environment.speed_unit;
  
  constructor(private expenseService: ExpenseService, private userService: UserService, private errorService: ErrorService) {
  }
  
  ngOnInit() {
    var that = this;
    
    // Subscribe for updates
    this.expenseService.expensesChanged.subscribe(
      (data)=>{
        that.expenses = data;
      }
    );
    // get expenses but done show errors
    this.get();
  }

  get(){
    this.expenseService.get();
  }

}
