import { Component, OnInit, Input } from '@angular/core';
import { ExpenseService } from '../../services/expenses.service';

@Component({
  selector: 'delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.css']
})
export class DeleteButtonComponent implements OnInit {
  constructor(private expenseService: ExpenseService) { }
  @Input('id') id;
  @Input('service') service;

  ngOnInit() {
  }

  delete(service){
    this[this.service].delete(this.id);
  }

}
