import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {CoursesService} from '../services/courses.service';
import {EMPTY_IMG} from '../common/ui-constants';


@Component({
  selector: 'edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  course$: Observable<Course>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService) {

    this.course$ = this.coursesService.selectCourseByUrl(route.snapshot.params['courseUrl']);

  }

  ngOnInit() {

  }

  imgSrc(course:Course) {
    return course.thumbnailUrl || EMPTY_IMG;
  }

}
