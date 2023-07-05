import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditamountPageRoutingModule } from './editamount-routing.module';

import { EditamountPage } from './editamount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditamountPageRoutingModule
  ],
  declarations: [EditamountPage]
})
export class EditamountPageModule {}
