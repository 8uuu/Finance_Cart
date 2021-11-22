import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonProfileRequest } from '../model/personProfileRequest';
import { environment } from 'src/environments/environment';
import constants from 'src/app/utils/constants';
import { IAccountRequest, IAccountResponse } from '../model/account.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterPersonService {


  constructor(private http:HttpClient) { }


  register(account: IAccountRequest) {
    return this.http.post<IAccountResponse>(constants.URI.ACCOUNT, account);
  }
}
