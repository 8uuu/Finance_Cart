import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPersonProfileResponse } from '../model/personProfileResponse';
import { IAccountModel } from '../model/account.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IAppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  isLoadingAction,
  setRolAction,
  stopLoadingAction,
} from 'src/app/redux/actions/ui.actions';
import Swal from 'sweetalert2';
import { setPersonAction } from 'src/app/redux/actions/person.actions';
import { IAuthJWT } from '../model/authjwt.model';
import { IAccountResponse } from '../model/accountResponse.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { IUser } from '../../../../redux/interface/user.interface';
import constants from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private url_base: string = environment.URI_BASE;
  private url: string = this.url_base + '/personprofiles';
  private urlAuthentication: string = this.url_base + '/login';

  constructor(
    private http: HttpClient,
    private store: Store<IAppState>,
    private router: Router
  ) {}

  getAll(): Observable<IPersonProfileResponse[]> {
    return this.http.get<IPersonProfileResponse[]>(this.url);
  }
  register(personProfile: IPersonProfileResponse) {
    return this.http.post(this.url, personProfile);
  }

  login(email: string, password: string) {
    this.store.dispatch(isLoadingAction());

    this.http.post(constants.URI.ACCOUNT_LOGIN, { email, password }).subscribe(
      (resp: any) => {
        console.log('[login]: ', resp);
        if (resp.ok) {
          this.showTast();
          this.router.navigate(['personProfiles']);
          localStorage.setItem('id',resp.body.id)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resp.body,
          });
        }
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.body,
        });
      }
    );
  }

  public showTast() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: '¡Bienvenido!',
    });
  }

  public logout() {
    this.router.navigate(['auth/login']);
    localStorage.clear();
  }
}
