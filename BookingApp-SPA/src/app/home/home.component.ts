import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  model: any = {};

  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {

  }

  login() {
    console.log(this.model);
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Logged in successfuly');
    }, error => {
      this.alertify.error(error);
    }, () => {
      if (this.authService.roleMatch(['Admin', 'Moderator'])) {
        this.router.navigate(['/members']);
      }
      if (this.authService.roleMatch(['Member'])) {
        this.router.navigate(['/members', this.authService.decodedToken.nameid]);
      }
    });
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
