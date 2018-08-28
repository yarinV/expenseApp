import { Component, OnInit, Input } from '@angular/core';
import { ExpenseService } from '../../services/expenses.service';
import { VehiclesService } from '../../services/vehicles.service';

@Component({
  selector: 'delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent implements OnInit {
  constructor(private expenseService: ExpenseService, private vehicleService: VehiclesService) { }
  @Input('id') id;
  @Input('deleteFrom') deleteFrom;

  ngOnInit() {
  }

  delete(){
    this[this.deleteFrom].delete(this.id);
  }

}
