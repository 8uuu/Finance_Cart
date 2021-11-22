import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FooterComponent } from './footer/footer/footer.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MaterialModule
  ],
   exports:[
     NavbarComponent,
     MatButtonModule,
     FooterComponent
   ]
})
export class ComponentsModule { }
