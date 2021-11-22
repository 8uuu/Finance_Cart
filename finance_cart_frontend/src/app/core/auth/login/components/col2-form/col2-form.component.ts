import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterPersonComponent } from '../../../register-person/pages/register-person/register-person.component';
import { LoginService } from '../../services/login.service';
import { IPersonProfileResponse } from '../../model/personProfileResponse';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../environments/environment';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-col2-form',
  templateUrl: './col2-form.component.html',
  styleUrls: ['./col2-form.component.scss'],
})
export class Col2FormComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public listPersons: IPersonProfileResponse[] = [];
  public env: string = environment.entorno;
  public subscription!: Subscription;
  public cargando: boolean = false;

  constructor(
    public dialog: MatDialog,
    private loginService: LoginService,
    private store: Store<IAppState>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.subscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
      console.log(this.cargando);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog() {
    this.dialog.open(RegisterPersonComponent, {
      width: '500px',
      height: 'auto',
    });
  }

  submitLogin() {
    const { email, password } = this.form.value;
    this.loginService.login(email, password);
  }
}
