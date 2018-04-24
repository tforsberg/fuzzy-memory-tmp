import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCourse from './course.reducer';
import {routerReducer} from '@ngrx/router-store';
import {RouterReducerState} from '@ngrx/router-store/src/router_store_module';
import * as fromDescriptions from './descriptions.reducer';
import * as fromCourseSection from './course-section.reducer';
import {storeFreeze} from 'ngrx-store-freeze';
import * as fromLesson from './lesson.reducer';
import {authReducer, AuthState} from './auth.reducer';
import {brandingReducer, BrandingState} from './branding.reducer';


export interface AppState {
  courses: fromCourse.State;
  router: RouterReducerState;
  descriptions: fromDescriptions.State;
  sections: fromCourseSection.State;
  lessons: fromLesson.State;
  auth: AuthState;
  branding: BrandingState;

}

export const reducers: ActionReducerMap<AppState> = {
  courses: fromCourse.reducer,
  router: routerReducer,
  descriptions: fromDescriptions.reducer,
  sections: fromCourseSection.reducer,
  lessons: fromLesson.reducer,
  auth: authReducer,
  branding: brandingReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];



