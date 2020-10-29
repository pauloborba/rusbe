import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private http: HttpClient) { }
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private pathUrl = 'http://localhost:3333/';
  private prefixRequest = 'menu/';

  public getDailyMenu(): Observable<any> {
    const url = this.pathUrl + this.prefixRequest + 'dailymenu';
    return this.http.get(url, {headers: this.headers});
  }

}