import { Component, Input, OnInit } from '@angular/core';
import { Review } from 'src/app/_models/review';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent implements OnInit {
  @Input() review: Review;

  constructor() { }

  ngOnInit() {
    console.log(this.review);
  }

}
