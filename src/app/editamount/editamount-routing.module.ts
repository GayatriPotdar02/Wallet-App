import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditamountPage } from './editamount.page';

const routes: Routes = [
  {
    path: '',
    component: EditamountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditamountPageRoutingModule {}
