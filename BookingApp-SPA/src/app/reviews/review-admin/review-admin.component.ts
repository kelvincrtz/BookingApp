import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Review } from 'src/app/_models/review';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-review-admin',
  templateUrl: './review-admin.component.html',
  styleUrls: ['./review-admin.component.css']
})
export class ReviewAdminComponent implements OnInit {
  reviews: Review[];

  constructor(private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.reviews = data.reviews;
    });
  }

}
