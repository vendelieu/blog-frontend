import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StoredImage } from '../interfaces/stored-image';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  constructor(private http: HttpClient) {}

  saveImage(url: string) {
    return this.http.post<StoredImage>(
      'https://www.filestackapi.com/api/store/S3?key=' + environment.images_key,
      new HttpParams({
        fromObject: {
          url: url
        }
      }),
      {
        observe: 'body'
      }
    );
  }
}
