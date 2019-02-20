import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  authsub = new Subscription();
  constructor(private authservice: AuthService) { }

  ngOnInit() {
    this.authservice.getAuthStatus().subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
    });
  }
  logout() {
    this.authservice.logout();
  }
  ngOnDestroy() {
    this.authsub.unsubscribe();
  }

}
