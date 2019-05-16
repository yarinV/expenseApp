import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  vehicle: Vehicle;
  vehicles: Array<Vehicle> = [];

  vehiclesRef;
  // handle vehicle select
  vehicleSelectedChanged = new EventEmitter();

  constructor(
    private db: AngularFirestore,
    private logService: LogService
  ) {
    this.vehiclesRef = this.db.collection('vehicles');
  }
  async get(data) {
    if (data.id !== undefined) {
      // Check if data exist on the service
      if (this.vehicles.length === 0) {
        return await this.getOneFromDB(data.id);
      } else {
        // check if item exist on service
        const document = this.vehicles.filter(item => data.id === item.id);
        if (document.length > 0) {
          return document[0];
        } else {
          return await this.getOneFromDB(data.id);
        }
      }
    } else {
      if (this.vehicles.length === 0) {
        if (!data.uid) {
          this.logService.msg('user_no_id');
          return [];
        }
        const docs = await this.getAllFromDB(data.uid);
        return docs;
      } else {
        return this.vehicles;
      }
    }
  }

  update(vehicle, cb) {
    this.updateDB(vehicle, cb);
  }

  delete(id, cb) {
    if (id !== undefined) {
      this.deleteFromDB(id, cb);
    }
  }

  private getOneFromDB(id) {
    return this.vehiclesRef.ref.doc(String(id)).get().then((item) => {
      // if not found try to get item from DB
      if (item.exists) {
        // if found resolve with the item
        return { ...item.data(), id: item.id };
      } else {
        // if not found reject and post error msg
        this.logService.msg('vehicle_not_found');
        return {};
      }
    });
  }

  private getAllFromDB(uid) {

    return this.vehiclesRef.ref.where('uid', '==', uid).get().then((list) => {
      this.vehicles = [];
      list.forEach((item) => {
        this.vehicles.push({ ...item.data(), id: item.id });
      });
      if (this.vehicles.length <= 0) {
        this.logService.msg('no_vehicles');
      }
      return this.vehicles;
    });
  }

  private updateDB(vehicle, cb) {
    vehicle.date = vehicle.date || Math.floor(Date.now() / 1000);
    this.vehiclesRef.doc(String(vehicle.id)).set(vehicle, { merge: true }).then(() => {
      // update local
      let matched: boolean;
      for (let i = 0; i < this.vehicles.length; i++) {
        if (this.vehicles[i].id === vehicle.id) {
          matched = true;
          this.vehicles.splice(i, 1);
          this.vehicles.push(vehicle);
        }
      }

      if (!matched) {
        this.vehicles.push(vehicle);
      }

      if (typeof cb === 'function') {
        cb();
      }
    }).catch(() => {

    });


  }

  private deleteFromDB(id, cb) {
    this.vehiclesRef.ref.doc(id).delete()
      .then(() => {
        console.log('Document successfully deleted!');
        for (let i = 0; i < this.vehicles.length; i++) {
          if (this.vehicles[i].id === id) {
            this.vehicles.splice(i, 1);
          }
        }
        if (typeof cb === 'function') {
          cb();
        }
      }).catch((error) => {
        console.error('Error removing document: ', error);
      });
  }


}
