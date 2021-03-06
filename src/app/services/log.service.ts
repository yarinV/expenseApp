import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  newMsg = new EventEmitter<string>();
  MESSAGES = {
    'no_expenses': 'There are no expenses for this vehicle',
    'expense_not_found': 'Expense Not Found',
    'expense_no_id': 'Expense ID not set',
    'expense_deleted': 'Expense successfully deleted!',
    'expense_updated': 'Expense successfully updated!',
    'expense_not_deleted': 'Error removing Expense',
    'expense_not_updated': 'Error updating Expense',
    'vehicle_select': 'Please Select Vehicle',
    'no_vehicles': 'You have no vehicles!',
    'vehicle_not_found': 'Vehicle Not Found',
    'vehicle_no_id': 'Vehicle ID not set',
    'please_login': 'Please login',
    'vehicleSelected_not_found': 'User Don\'t have default vehicle',
    'user_no_id': 'User id not found',
    
  };

  msg(msg){
    this.newMsg.emit(this.MESSAGES[msg] || msg);
  }

  clear(){
    this.newMsg.emit('');
  }
}
