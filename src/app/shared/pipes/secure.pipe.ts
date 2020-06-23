import { PipeTransform, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  transform(url: string): Observable<SafeUrl> {
    return new Observable<string>((observer) => {
      // This is a tiny blank image
      observer.next('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

      // The next and error callbacks from the observer
      const { next, error } = observer;

      this.http.get(url, { responseType: 'blob' }).subscribe(response => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          observer.next(reader.result as string);
        };
      });
      return { unsubscribe() { } };
    });
  }

}
