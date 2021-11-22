import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterPersonComponent } from './pages/register-person/register-person.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthRoutingModule } from '../auth-routing.module';


@NgModule({
  declarations: [
    RegisterPersonComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MaterialModule,
    AuthRoutingModule
  ],
  exports: [
    RegisterPersonComponent
  ]
})
export class RegisterPersonModule { }
