import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { createClient } from 'contentful';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CrudapiService {
  public apiUrl = 'https://gorest.co.in/public/v2/posts';

  constructor(public http: HttpClient) {}

  private client = createClient({
    space: environment.spaceId,
    accessToken: environment.accessToken,
  });

  getAllEntries() {
    const promise = this.client.getEntries();
    return from(promise);
  }

  getUrlData() {
    let header = new HttpHeaders();
    return this.http.get<any>(this.apiUrl, {
      headers: header,
    });
  }
}
