import { Component, OnInit } from '@angular/core';
import {Course} from '../models/course.model';
import {Observable} from 'rxjs/Observable';
import {
  selectActiveCourse, selectActiveCourseAllLessons, selectActiveCourseSections, selectActiveLesson,
  selectActiveSection
} from '../store/selectors';
import {select, Store} from '@ngrx/store';
import {CourseSection} from '../models/course-section.model';
import {Lesson} from '../models/lesson.model';
import {AppState} from '../store';
import {UrlBuilderService} from '../services/url-builder.service';
import {Router} from '@angular/router';



@Component({
  selector: 'watch-course',
  templateUrl: './watch-course.component.html',
  styleUrls: ['./watch-course.component.scss']

})
export class WatchCourseComponent implements OnInit {

  course$: Observable<Course>;

  sections$: Observable<CourseSection[]>;

  lessons$ : Observable<Lesson[]>;

  activeSection$: Observable<CourseSection>;

  activeLesson$: Observable<Lesson>;

  leftMenuOpened = true;

  autoPlay = true;


  constructor(
    private store: Store<AppState>,
    public ub: UrlBuilderService,
    private router:Router) {

  }


  ngOnInit() {

    const storedAutoplay = localStorage.getItem('autoPlay');

    if (storedAutoplay) {
      this.autoPlay = JSON.parse(storedAutoplay);
    }

    this.course$ = this.store.pipe(select(selectActiveCourse));

    this.sections$ = this.store.pipe(select(selectActiveCourseSections));

    this.lessons$ = this.store.pipe(select(selectActiveCourseAllLessons));

    this.lessons$ = this.store.pipe(select(selectActiveCourseAllLessons));

    this.activeSection$ = this.store.pipe(select(selectActiveSection));

    this.activeLesson$ =  this.store.pipe(select(selectActiveLesson));

  }

  toggleLeftMenu() {
    this.leftMenuOpened = !this.leftMenuOpened;
  }

  onExit(course:Course) {
    this.router.navigate(['/courses', course.url]);
  }

  onAutoPlayChange() {
    localStorage.setItem('autoPlay', JSON.stringify(this.autoPlay));
  }


}
