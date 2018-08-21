import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';

import { UserService } from './user.service';
import { VehiclesService } from './vehicles.service';
@Injectable()
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private vehicleService: VehiclesService,
  ){

    this.userService.getUser(()=>{
      this.afterLoginDo();
    });
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

  afterLoginDo(){
    // get user selected vehicle id & get the vehicle with the selected vehicle id and assign it to vehicle in vehicleService
    // then header.component can display the selected vehicle
    if(this.vehicleService.vehicle !== undefined){
      return false;
    }
    this.userService.getVehicleSelected().then(id=>{
      this.vehicleService.get(id)
      this.vehicleService.documentFetched.subscribe(doc=>{
        this.vehicleService.vehicle = doc;
      })
    });
  }
}