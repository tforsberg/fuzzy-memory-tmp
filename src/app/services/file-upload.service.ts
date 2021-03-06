import { Injectable } from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {TenantService} from './tenant.service';
import {generateId} from '../common/unique-id-generator';
import {AngularFireUploadTask} from '@angular/fire/storage/task';


@Injectable()
export class FileUploadService {


  constructor(
    private storage: AngularFireStorage,
    private tenant: TenantService
  ) {

  }

  uploadImageThumbnail(image:File, imagePath:string): Observable<any> {

    const uploadPath = imagePath + '/' + image.name;

    return this.storage.upload(uploadPath, image)
      .percentageChanges();
  }


  uploadVideo(courseId: string, lessonId:string, video: File): AngularFireUploadTask {

    const prefix = generateId();

    const uploadPath = `${this.tenant.id}/${courseId}/videos/${lessonId}/${prefix}-${video.name}`;

    return this.storage.upload(uploadPath, video, {cacheControl: 'public,max-age=25920000, s-maxage=25920000'});

  }
}
