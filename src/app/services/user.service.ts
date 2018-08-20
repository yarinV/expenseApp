import { Injectable, NgZone } from "@angular/core";
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
    private zone: NgZone,
   ){
      this.userRef = this.db.collection('users');
  }

  getUser(){
    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
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
  
  updateVehicleSelected(vehicle_id){
    // TODO: update db with vehicle selected

  }

  getVehicleSelected(showError?){
    return new Promise((resolve, reject)=>{
     
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
      
    })
  }
}
