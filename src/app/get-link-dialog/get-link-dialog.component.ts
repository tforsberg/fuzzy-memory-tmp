import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
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
  selector: 'get-link-dialog',
  templateUrl: './get-link-dialog.component.html',
  styleUrls: ['./get-link-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetLinkDialogComponent implements OnInit, AfterViewInit {

  link:string;

  @ViewChild('input')
  copyInput: ElementRef;


  constructor(@Inject(MAT_DIALOG_DATA) data,
              private dialogRef: MatDialogRef<GetLinkDialogComponent>) {


    this.link = `https://onlinecoursehost.com/courses/${data.course.seqNo}?couponCode=${data.coupon.code}`;

  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    this.copyInput.nativeElement.select();

    document.execCommand("copy");

  }

  close() {
    this.dialogRef.close();
  }

}
