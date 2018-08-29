import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';

import { UserService } from './user.service';
@Injectable()
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
  ){

    this.userService.getUser();
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.userService.updateUserData(credential.user)
      })
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
         this.router.navigate(['/']);
    });
  }

}