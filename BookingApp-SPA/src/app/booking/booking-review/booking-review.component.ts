import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { Booking } from 'src/app/_models/booking';
import { Review } from 'src/app/_models/review';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { BookingService } from 'src/app/_services/booking.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.component.html',
  styleUrls: ['./booking-review.component.css']
})
export class BookingReviewComponent implements OnInit {
  booking: Booking;

  reviewForm: FormGroup;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  rating = 3;

  review: Review;
  fileToSend: FileItem;

  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private router: Router,
              private bookingService: BookingService, private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.booking = data.booking;
    });

    this.initializeUploader();

    this.reviewForm = new FormGroup({
      description: new FormControl('First test from SPA', Validators.required),
      rating: new FormControl(3, Validators.required),
      booking: new FormControl(this.booking, Validators.required),
    });
  }

  registerReview() {
    if (this.reviewForm.valid) {
      this.review = Object.assign({}, this.reviewForm.value);

      this.bookingService.createReview(this.authService.decodedToken.nameid, this.review).subscribe(next => {
        this.alertify.success('Review has been submitted');
      }, error => {
        this.alertify.error('Error sending the review');
      }, () => {
        this.router.navigate(['/home/']);
      });
    }
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'reviews/users/' + this.authService.decodedToken.nameid,
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('description', 'test from SPA'); // note comma separating key and value
      form.append('rating', 1);
      form.append('bookingId', 1);
      form.append('userId', 6);
     };

  }

  uploadSection() {
    this.review = Object.assign({}, this.reviewForm.value);
    this.review.userId = this.authService.decodedToken.nameid;
    this.uploader.uploadAll();
  }

}
