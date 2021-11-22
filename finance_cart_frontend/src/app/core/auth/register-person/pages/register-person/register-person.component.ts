import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegisterPersonService } from '../../services/register-person.service';
import Swal from 'sweetalert2';
import { IAccountResponse } from '../../model/account.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-person',
  templateUrl: './register-person.component.html',
  styleUrls: ['./register-person.component.scss'],
})
export class RegisterPersonComponent implements OnInit {

  public form!: FormGroup;
  public selectedCategoryPerson = 1;

  constructor(
    private registerPersonService: RegisterPersonService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router:Router
  ) {}


  ngOnInit(): void {

    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      dni: ['', Validators.required],
    });
  }

  showTast() {
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
      title: '¡Ya puedes iniciar sesión!',
    });
  }

  operar(): void {
    console.log('submit');
    // console.log('this.form.value: ',this.form.value);
    console.log('selectedCategoryPerson: ', this.selectedCategoryPerson);
    
    this.registerPersonService.register(this.form.value).subscribe(
      (data:IAccountResponse) => {
        console.log('[Register] data: ', data);
        if(data.ok){
          this.dialog.closeAll();
          this.showTast();
          // this.router.navigate(['personProfiles']);
        }
      },
      (err) => {
        console.log('err: ', err);
        console.log('err: ', err.error.mensaje);
      }
    );
  }
}
