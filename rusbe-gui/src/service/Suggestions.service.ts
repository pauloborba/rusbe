import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import Suggestion from '../../../common/suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {
  private readonly headers = new HttpHeaders({'Content-Type': 'application/json'});
  private readonly apiURL = 'http://localhost:3333/suggestions';

  constructor(public http: HttpClient) { }

  getUserSuggestions(userId): Observable<any> {
    return this.http.get(`${this.apiURL}?userId=${userId}`, {headers: this.headers});
  }

  newSuggestion(suggestion: Suggestion): Observable<any> {
    return this.http.post(this.apiURL + '/new', suggestion, {headers: this.headers});
  }
}
