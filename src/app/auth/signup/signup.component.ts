import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  authSub: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSub = this.authService.getAuthStatus().subscribe( authUser => {
      this.isLoading = false;
    });
  }

  onsignin(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  onImageAdded(e) {

  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
