import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {URL_PATH_REGEX} from '../common/regex';
import {MessagesService} from '../services/messages.service';
import {Course} from '../models/course.model';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {AddCourse} from '../store/course.actions';
import {CoursesDBService} from '../services/courses-db.service';
import {LoadingService} from '../services/loading.service';
import {CourseCoupon} from '../models/coupon.model';
import {CourseCouponsDbService} from '../services/course-coupons-db.service';
import * as firebase from 'firebase/app';
import {AddCoupon} from '../store/coupons.actions';



@Component({
  selector: 'add-course-dialog',
  templateUrl: './add-coupon-dialog.component.html',
  styleUrls: ['./add-coupon-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MessagesService
  ]
})
export class AddCouponDialogComponent implements OnInit {

  form: FormGroup;

  course: Course;

  priceControl = new FormControl(null);

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data,
              private dialogRef: MatDialogRef<AddCouponDialogComponent>,
              private couponsDb: CourseCouponsDbService,
              private store: Store<AppState>,
              private messages: MessagesService) {

    this.course = data.course;

  }

  ngOnInit() {

    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9-_]+$")]],
      free: [false, Validators.required],
      price: this.priceControl,
      remaining: [null, Validators.required],
      deadline: [null]
    });

    this.form.valueChanges
      .subscribe((coupon:CourseCoupon) => {

        if (coupon.free) {
          this.priceControl.disable({emitEvent: false});
        }
        else {
          this.priceControl.enable({emitEvent:false});
        }

      });

  }

  close() {
    this.dialogRef.close();
  }

  save() {

    const coupon = this.form.value;
    coupon.active = true;
    coupon.created = firebase.firestore.Timestamp.fromDate(new Date());
    coupon.deadline = coupon.deadline ? firebase.firestore.Timestamp.fromDate(coupon.deadline) : null;

    this.couponsDb.createNewCoupon(this.course.id, coupon)
      .subscribe(
        coupon => {

         this.store.dispatch(new AddCoupon({coupon}));

          this.dialogRef.close()

        },
        err => this.messages.error(err)
    );

  }

}
