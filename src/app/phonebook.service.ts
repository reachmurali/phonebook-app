import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "./bean/User";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PhonebookService {

  private REST_URL = environment.REST_URL;

  constructor(private httpClient: HttpClient) {
  }


  saveUser(user: User): Observable<any> {
    return this.httpClient.post(this.REST_URL + "saveUser", user);
  }

  fetchUsers(): Observable<any> {
    return this.httpClient.post(this.REST_URL + "fetchPhoneBook", {});
  }

  deleteuser(u: User): Observable<any> {
    return this.httpClient.post(this.REST_URL + "deleteUser", u);
  }
}
