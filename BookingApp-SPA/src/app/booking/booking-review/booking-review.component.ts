import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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

  baseUrl = environment.apiUrl;

  rating = 0;

  review: Review;

  modalRef: BsModalRef;

  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private router: Router,
              private bookingService: BookingService, private authService: AuthService, private userService: UserService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.booking = data.booking;
    });

    this.initializeUploader();

    this.reviewForm = new FormGroup({
      description: new FormControl('', Validators.required),
      rating: new FormControl(this.rating, Validators.required),
    });
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

  }

  uploadSection(template: TemplateRef<any>) {
    if (this.reviewForm.valid) {
      this.review = Object.assign({}, this.reviewForm.value);

      this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
        form.append('description', this.review.description); // note comma separating key and value
        form.append('rating', this.rating);
        form.append('bookingId', this.booking.id);
        form.append('userId', this.authService.decodedToken.nameid);
        form.append('booking', this.booking);
       };

      this.uploader.uploadAll();

      this.uploader.onSuccessItem = (item, response, status, headers) => {
        this.modalRef = this.modalService.show(template, {class: 'modal-md'});
        this.router.navigate(['/bookingsforuser/']);
      };
    }
  }

  backToBookings() {
    this.modalRef.hide();
  }

  cancel() {
    this.router.navigate(['/bookingsforuser/']);
  }
}
