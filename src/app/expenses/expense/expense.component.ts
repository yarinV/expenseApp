import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ExpenseService } from '../../services/expenses.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  item;
  speed_unit = environment.speed_unit;
  @Input('expenseInput') expenseInput;

  constructor(private route:ActivatedRoute, private expenseService:ExpenseService, private location:Location) { }

  ngOnInit() {
    // will show the expense by route or as a template item 
    if(this.route.snapshot.paramMap.get('id') == null){
      this.item = this.expenseInput;
    }else{
      this.getExpense();
    }
  }

  getExpense(){
    let that = this;
    const id = this.route.snapshot.paramMap.get('id');
    this.expenseService.get(id);

    this.expenseService.documentFetched.subscribe((document)=>{
      that.item = document;
    });
  }

  deleteExpense(id){
    this.expenseService.delete(id);
  }

  goBack(): void{
    this.location.back();
  }

}
