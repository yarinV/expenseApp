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
  doc;
  speed_unit = environment.speed_unit;
  @Input('document') document;

  constructor(private route:ActivatedRoute, private expenseService:ExpenseService, private location:Location) { }

  ngOnInit() {
    // will show the expense by route or as a template doc
    let id = this.route.snapshot.paramMap.get('id');
    if( id == null){
      this.doc = this.document;
    }else{
      this.get(id);
    }
  }

  get(id){
    this.expenseService.get(id);
    this.expenseService.expenseDocFetched.subscribe((document)=>{
      this.doc = document;
    });
  }

  goBack(): void{
    this.location.back();
  }

}
