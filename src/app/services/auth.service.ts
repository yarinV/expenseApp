import { Injectable } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { Router } from '@angular/router';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  vehicleSelected?: string;
}


@Injectable()
export class AuthService {

  user: Observable<User>;
  userData;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ){
      // Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            // Get user data
            this.setData(user);
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null)
          }
        })
      );
    }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }


  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    return userRef.set(this.setData(user), { merge: true })
  }

  setData(user){
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      vehicleSelected: user.vehicleSelected,
    }
    this.userData = data;
    return data;
  }


  signOut() {
    this.afAuth.auth.signOut().then(() => {
         this.router.navigate(['/']);
    });
  }
}