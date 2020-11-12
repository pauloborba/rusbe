import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, retry} from 'rxjs/operators';
import {QueueStatusEnum} from '../../../common/QueueStatus.enum';

@Injectable()
export class QueueService {
    constructor(public http: HttpClient) {
    }

    private headers = new HttpHeaders({'Content-Type': 'application/json'});
    private apiURL = 'http://localhost:3333';
    private queueRoute = '/queue';
    private voteRoute = '/vote';

    /**
     * Performs a request to the server intended to get info of user's right to vote.
     * @param userInfo The user info to be sent as the request body.
     * @returns A boolean indicating the user vote right information.
     */
    canVote(userInfo): Observable<boolean> {
        return this.http.post<any>(this.apiURL + this.queueRoute + '/voteRight', userInfo, {headers: this.headers}).pipe(
            retry(3),
            map(response => {
                if (!response.message) {
                    return response as boolean;
                } else {
                    throw new Error(response.message);
                }
            })
        );
    }

    /**
     * Performs a request to the server intended to register the user's vote.
     * @param votationObject The votation object containing the user who voted and its vote.
     * @returns A boolean indicating if the user vote was registered.
     */
    doVote(votationObject: object): Observable<boolean> {
        return this.http.post<any>(this.apiURL + this.queueRoute + this.voteRoute, votationObject, {headers: this.headers}).pipe(
            retry(3),
            map(response => {
                if (!response.message) {
                    return response as boolean;
                } else {
                    throw new Error('Could not vote.');
                }
            })
        );
    }

    /**
     * Performs a request to the server intended to get the queue status.
     * @returns A value of QueueStatusEnum indicating the queue status.
     */
    getQueueStatus(): Observable<QueueStatusEnum> {
        return this.http.get<any>(this.apiURL + this.queueRoute, {headers: this.headers}).pipe(
            retry(3),
            map(response => {
                if (!response.message) {
                    return response.status;
                } else {
                    throw new Error('Could not get queue status.');
                }
            })
        );
    }
}
