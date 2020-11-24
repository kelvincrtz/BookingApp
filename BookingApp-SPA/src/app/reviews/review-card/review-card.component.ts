import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Review } from 'src/app/_models/review';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ReviewEditComponent } from '../review-edit/review-edit.component';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent implements OnInit {
  reviews: Review[];
  bsModalRef: any;

  constructor(private alertify: AlertifyService, private modalService: BsModalService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.reviews = data.reviews;
    });
  }

  openEditModal(review: Review): void {
    const initialState = {
        review
    };

    this.bsModalRef = this.modalService.show(ReviewEditComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.reviewBackToReviewsUser.subscribe((value: Review) => {
      this.reviews.splice(this.reviews.findIndex(b => b.id === review.id), 1, value);
    }, error => {
        this.alertify.error('Failed to update review' + error);
    });
  }

}
