import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
export class GroupsService {
  constructor(public http: HttpClient) { }
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private pathUrl = 'http://localhost:3333/';
  getUserGroups(userID): Observable<any>{
    return this.http.get(this.pathUrl+'usergroups'+'?id='+userID, {headers: this.headers});
  }
  createGroup(usersID, name): Observable<any>{
    return this.http.post(this.pathUrl+'creategroup', {headers: this.headers, members: usersID, name: name});
  }
}