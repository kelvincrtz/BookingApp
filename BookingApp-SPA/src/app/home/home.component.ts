import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../_models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  user: User;
  loginForm: FormGroup;

  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  loginClick() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.user = Object.assign({}, this.loginForm.value);
      this.authService.login(this.user).subscribe(next => {
        this.alertify.success('Logged in successfuly');
      }, error => {
        this.alertify.error('User does not exist');
      }, () => {
        if (this.authService.roleMatch(['Admin', 'Moderator'])) {
          this.router.navigate(['/members']);
        }
        if (this.authService.roleMatch(['Member'])) {
          this.router.navigate(['/members', this.authService.decodedToken.nameid]);
        }
      });
    }
  }

  registerToggle() {
    this.registerMode = true;
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }

  scrollToElement($element): void {
    console.log($element);
    // tslint:disable-next-line: quotemark
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}
