import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/material/material.module';
import { Col1ImgComponent } from './components/col1-img/col1-img.component';
import { Col2FormComponent } from './components/col2-form/col2-form.component';
import { AuthRoutingModule } from '../auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    Col1ImgComponent,
    Col2FormComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MaterialModule,
    AuthRoutingModule
    
  ],
  exports:[
    LoginComponent
  ]
})
export class LoginModule { }
