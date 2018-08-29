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
  expenses;
  speed_unit = environment.speed_unit;
  
  constructor(private expenseService: ExpenseService, private userService: UserService, private errorService: ErrorService) {
  }
  
  ngOnInit() {
    // get expenses but dont show errors
    this.expenseService.get().then((data)=>{this.expenses = data});
  }


}
