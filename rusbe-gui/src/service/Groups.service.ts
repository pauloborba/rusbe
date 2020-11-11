import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import Message from '../../../common/message'
@Injectable({
  providedIn: 'root'
}) 
export class GroupsService {
  constructor(public http: HttpClient) { }
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private pathUrl = 'http://localhost:3333/groups/';
  getUserGroups(userID): Observable<any>{
    return this.http.get(this.pathUrl+'usergroups'+'?id='+userID, {headers: this.headers});
  }
  createGroup(usersID, name): Observable<any>{
    return this.http.post(this.pathUrl+'creategroup', {headers: this.headers, members: usersID, name: name});
  }
  getInfoGroup(groupId, userId):Observable<any>{
    return this.http.get(this.pathUrl+"groupinfo"+"?id="+groupId+"&userId="+userId , {headers: this.headers})
  }
  postMyTime(groupId, meal_time, msg): Observable<any>{
    return this.http.post(this.pathUrl+'postmytime', {headers: this.headers, groupId, meal_time, msg});
  }
  deleteMyTime(groupId: string, meal: string, msg: Message, userId: any): Observable<any>{
    return this.http.put(this.pathUrl+'deletemytime', {headers: this.headers, groupId, userId, meal, msg});
  }
}