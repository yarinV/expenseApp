import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ExpenseService } from '../../services/expenses.service';
import { environment } from '../../../environments/environment';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  doc;
  speed_unit = environment.speed_unit;
  @Input('document') document;

  constructor(
    private route:ActivatedRoute,
    private expenseService:ExpenseService,
    private location:Location,
    private LoaderService:LoaderService
  ) { }

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
    this.LoaderService.startLoading();
    this.expenseService.get(id);
    this.expenseService.expenseDocFetched.subscribe((document)=>{
      this.doc = document;
      this.LoaderService.finishLoading();
    });
  }

  goBack(): void{
    this.location.back();
  }

}
