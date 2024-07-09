import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticeRoutingModule } from './practice-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion'; // Import MatExpansionModule
import { MatPaginatorModule } from '@angular/material/paginator'; // Import MatPaginatorModule
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatSortModule } from '@angular/material/sort'; // Optionally, if you're using sorting
import { ReactiveFormsModule } from '@angular/forms';

import { PracticeComponent } from './practice.component';
import { ListComponent } from './list/list.component';
import { PracticeAddComponent } from './add/add.component';
import { PracticeLocationAddComponent } from './location/add/add.component';


@NgModule({
  declarations: [
    PracticeComponent,
    ListComponent,
    PracticeAddComponent,
    PracticeLocationAddComponent
  ],
  imports: [
    CommonModule,
    PracticeRoutingModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule
  ]
})
export class PracticeModule { }
