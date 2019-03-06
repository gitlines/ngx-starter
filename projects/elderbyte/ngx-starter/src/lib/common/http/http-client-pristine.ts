import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';

/**
 * A HttpClient without any interceptors
 */
@Injectable({
  providedIn: 'root'
})
export class HttpClientPristine extends HttpClient {

  constructor(backend: HttpBackend) {
    super(backend);
  }
}
