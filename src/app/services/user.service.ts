import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ErrorService } from "./error.service";
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
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private errorService: ErrorService,
   ){
      this.userRef = this.db.collection('users');
  }

  getUser(cb){
    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
     switchMap(user => {
       if (user) {
         // Get user data
         this.setData(user);
         if(typeof cb == "function"){
           cb();
         }
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
  
  updateVehicleSelected(id, name){
    this.userData.vehicle_name = name;
    let user = this.db.doc(`users/${this.userData.uid}`);
    user.update({'vehicleSelected':id});
  }

  getVehicleSelected(showError?){
    return new Promise((resolve, reject)=>{
      if(!this.userData){
        if(showError){
          this.errorService.msg("please_login");
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
                this.errorService.msg("vehicleSelected_not_found");
              }
              reject();
          }
      });
    });
  }

}
