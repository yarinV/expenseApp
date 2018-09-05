import { Component, OnInit, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

import { ExpenseService } from '../services/expenses.service';
import { LoaderService } from '../services/loader.service';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses;
  speed_unit = environment.speed_unit;
  
  constructor(
    private expenseService: ExpenseService,
    private LoaderService:LoaderService) {
  }
  
  ngOnInit() {
    this.get();
    // when selectedVehicle changed get new expenses
    this.expenseService.expensesChanged.subscribe(()=>{
      this.get();
    });
  }

  get(){
    this.LoaderService.startLoading();
    // get expenses but dont show errors
    this.expenseService.get().then((data)=>{
      this.expenses = data;
      this.LoaderService.finishLoading();
    });
  }

}
