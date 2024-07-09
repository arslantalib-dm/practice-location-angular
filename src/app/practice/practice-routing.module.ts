import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticeComponent } from './practice.component';
import { PracticeAddComponent } from './add/add.component';

const routes: Routes = [
  {
    path: 'practice',
    // redirectTo: 'list', // Redirect to 'list' if path is empty
    // pathMatch: 'full',   // Ensure that the full path is empty before redirecting
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: PracticeComponent,
      },
      {
        path: 'location',
        component: PracticeAddComponent,
      },
      {
        path: 'location/:id',
        component: PracticeAddComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticeRoutingModule { }
