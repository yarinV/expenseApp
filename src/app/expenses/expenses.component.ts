import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private loaderService: LoaderService,
    private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.expenses = [];
    // Subscribe for updates
    this.expenseService.expensesChanged.subscribe( res => {
        if(!res){
          this.expensesList = [];
          return;
        }

        this.expensesList = [...res];
        this.loaderService.finishLoading();
        if (!this.ref['destroyed']) {
            this.ref.detectChanges();
        }
      }
    );
    // get expenses but dont show errors
    this.get();
  }

  get() {
    this.loaderService.startLoading();
    this.expenseService.get();
  }

  get expensesList() {
    return this.expenses;
  }

  set expensesList(data) {
    this.expenses = data;
  }

}
