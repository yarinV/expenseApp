import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Expense } from '../expenses/expense';
import { VehiclesService } from './vehicles.service';
import { LogService } from './log.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  expenses;
  expenseRef;

  expensesChanged = new EventEmitter();
  expenseDocFetched = new EventEmitter<any>();

  constructor(
    private db: AngularFirestore,
    private vehiclesService: VehiclesService,
    private userService: UserService,
    private logService: LogService,
  ) {
    // Vehicle changed get the expenses
    this.vehiclesService.vehicleSelectedChanged.subscribe(
      () => {
        this.getAllFromDB();
        this.logService.clear();
      }
    );
    this.expenseRef = this.db.collection('expenses');
  }

  get(id?) {
    if (id !== undefined) {
      // get one document
      if (this.expenses === undefined) {
        this.getOneFromDB(id);
      } else {
        const doc = this.expenses.filter(item => id === +item.id);
        doc.length > 0 ? this.expenseDocFetched.emit(doc) : this.getOneFromDB(id);
      }
    } else {
      // get all documents
      if (this.expenses === undefined) {
        this.getAllFromDB();
      } else {
        this.expenses.length > 0 ? this.expensesChanged.emit(this.expenses) : this.getAllFromDB();
      }
    }
  }

  update(expense, cb) {
    this.updateDB(expense, cb);
  }

  delete(id, cb) {

    if (id !== undefined) {
      this.deleteFromDB(id, cb);
      return;
    }
  }

  getOneFromDB(id) {
    this.expenseRef.ref.doc(String(id)).onSnapshot((item) => {

      // if not found try to get item from DB
      if (item.exists) {
        // if found resolve with the item
        this.expenseDocFetched.emit({ ...item.data(), id: item.id });
      } else {
        // if not found reject and post error msg
        this.logService.msg('expense_not_found');
      }

    });
  }

  getOneFromDBAsync(id) {
    this.expenseRef.ref.doc(String(id)).get().then((item) => {
      // if not found try to get item from DB
      if (item.exists) {
        // if found resolve with the item
        this.expenseDocFetched.emit({ ...item.data(), id: item.id });
      } else {
        // if not found reject and post error msg
        this.logService.msg('expense_not_found');
        this.expenseDocFetched.emit({});
      }
    });
  }

  getAllFromDB() {

    this.checkVehicleSelected().then((data) => {
      const vehicleSelected = data;

      if (vehicleSelected === '') {
        return false;
      }

      this.expenseRef.ref.where('vehicleId', '==', vehicleSelected).onSnapshot((list) => {
        this.expenses = new Array<any>();
        list.forEach((item) => {
          this.expenses.push({ ...item.data(), id: item.id });
        });
        if (this.expenses.length <= 0) {
          this.logService.msg('no_expenses');
          return false;
        } else {
          this.logService.clear();
        }

        // return empty or list with data
        this.expensesChanged.emit(this.expenses);


      });

    });

  }

  async getAllFromDbAsync(data, cb?) {
    if (!data.vehicle) {
      let temp;
      await this.checkVehicleSelected().then((item) => { temp = item; });
      data.vehicle = temp;
    }

    return this.expenseRef.ref.where('vehicleId', '==', data.vehicle).get().then((list) => {
      const expenses = [];
      list.forEach((item) => {
        expenses.push({ ...item.data(), id: item.id });
      });

      if (expenses.length <= 0) {
        if (data.showError) {
          this.logService.msg('no_expenses');
        }
      } else {
        this.logService.clear();
      }

      // return empty or list with data
      if (data.updateLocal) {
        this.expenses = expenses;
      }
      if (typeof cb === 'function') {
        cb();
      }
      return expenses;
    });
  }

  updateDB(expense, cb) {

    this.checkVehicleSelected(true).then((results) => {
      const vehicleSelected = results;
      const timestamp = Math.floor(Date.now());

      if (vehicleSelected === '' && expense.vehicleId === undefined) {
        return false;
      }

      if (expense.id === undefined) {
        this.logService.msg('expense_no_id');
        return false;
      } else {
        this.logService.clear();
      }

      expense.date = expense.date || timestamp;
      expense.vehicleId = vehicleSelected;

      this.expenseRef.doc(String(expense.id)).set(expense).then(() => {
        if (typeof cb === 'function') {
          cb();
        }
        // update the local
        for (let i = 0; i < this.expenses.length; i++) {
          const element = this.expenses[i];
          if (element.id === expense.id) {
            this.expenses[i] = { ...expense };
            break;
          }
        }

        this.logService.msg('expense_updated');
      }).catch((error) => {
        this.logService.msg('expense_not_updated');
        this.logService.msg(error);
      });

    });
  }

  deleteFromDB(id, cb) {
    this.expenseRef.ref.doc(id).delete()
      .then(() => {
        this.logService.msg('expense_deleted');
        // After delete get all expenses from db and update local
        this.getAllFromDbAsync({ updateLocal: true, showError: true }, () => {
          this.expensesChanged.emit();
          if (typeof cb === 'function') {
            cb();
          }
        });
      }).catch((error) => {
        this.logService.msg('expense_not_deleted');
        this.logService.msg(error);
      });
  }

  async checkVehicleSelected(showError?) {
    const vehicleSelected: string = this.userService.userData.vehicleSelected;
    if (vehicleSelected !== undefined) {
      return vehicleSelected;
    } else {
      // Get user selected vehicle from DB
      const newVehicleSelected = await this.userService.getVehicleSelected(false);
      if (newVehicleSelected === '') {
        if (showError) {
          this.logService.msg('vehicle_select');
        }
      }
      return newVehicleSelected;
    }
  }

  async calculateTotal(vehicles) {
    const total = [];
    for (let i = 0; i < vehicles.length; i++) {
      const item = vehicles[i];
      await this.getAllFromDbAsync({ vehicle: item.id, showError: false }).then((expenses) => {
        total[item.id] = 0;
        expenses.forEach((expense) => {
          total[item.id] += +expense.sum;
        });
      });
    }
    return total;
  }
}
