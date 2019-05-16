import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { LogService } from "./log.service";
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { AngularFireAuth } from "angularfire2/auth";

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  vehicleSelected?: string;
  vehicle_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userRef;

  user: Observable<User>;
  userData;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private db: AngularFirestore,
    private logService: LogService,
   ){
      this.userRef = this.db.collection('users');
  }

  getUser(){
    // Get auth data, then get firestore user document || null
    this.user = this.angularFireAuth.authState.pipe(
     switchMap(user => {
       if (user) {
         // Get user data
         this.setData(user);
         return this.db.doc(`users/${user.uid}`).valueChanges();
       } else {
         return of(null)
       }
     })
   );
  }

  setData(user){
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }
    this.userData = data;

    return data;
  }

  updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    return userRef.set(this.setData(user), { merge: true })
  }

  updateVehicleSelected(data){
    let user = this.db.doc(`users/${this.userData.uid}`);
    return user.update({'vehicleSelected': data.id}).then(()=>{
      this.userData.vehicle_name = data.name;
      this.userData.vehicleSelected = data.id;
    })
  }

  getVehicleSelected(showError?){
    return new Promise((resolve, reject)=>{
      if(!this.userData){
        if(showError){
          this.logService.msg("please_login");
        }
        reject();
      }

      this.userRef.ref.doc(this.userData.uid).onSnapshot((item)=>{
          let user = item.data();
          if(user.vehicleSelected !== undefined){
            this.userData.vehicleSelected = user.vehicleSelected;
            resolve(user.vehicleSelected);
          } else {
              if(showError){
                this.logService.msg("vehicleSelected_not_found");
              }
              reject();
          }
      });
    });
  }

}
