import { Component, ElementRef, OnInit } from '@angular/core';
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
  public isCollapsed = false;
  constructor(public auth: AuthService, public vehicleService: VehiclesService, public userService: UserService, private elementRef: ElementRef  ) {

   }

  ngOnInit() {
    // let menuBtn = this.elementRef.nativeElement.querySelectorAll('.menu-btn')[0];
    // menuBtn.addEventListener('click', ()=>{
    //   menuBtn.collapse('toggle');
    //   $('#myCollapsible').collapse({
    //     toggle: false
    //   })
    // })
  }

}
