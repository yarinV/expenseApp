import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { VehiclesService } from '../services/vehicles.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  vehicleSelected;

  constructor(public auth: AuthService, public vehicleService: VehiclesService, public userService: UserService ) {
    
   }

  ngOnInit() {}

}
