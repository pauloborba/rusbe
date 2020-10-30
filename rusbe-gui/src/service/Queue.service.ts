import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map, retry} from 'rxjs/operators';

@Injectable()
export class QueueService {
  constructor(public http: HttpClient) { }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private apiURL = 'http://localhost:3333';
  private queueRoute = '/queue';

  /**
   * Performs a request to the server intended to get info of user's right to vote.
   * @param userInfo The user info to be sent as the request body.
   * @returns A boolean indicating the user vote right information.
   */
  canVote(userInfo): Observable<boolean> {
    return this.http.post<any>(this.apiURL + this.queueRoute + '/voteRight', userInfo, {headers: this.headers}).pipe(
        retry(3),
        map( response => {
          if (!response.message) {
            return response as boolean;
          }
          else {
            throw new Error(response.message);
          }
        })
    );
  }
}
