import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributorsFormComponent } from '../../components/distributors-components/distributors-form/distributors-form.component';
import { DistributorsTableComponent } from '../../components/distributors-components/distributors-table/distributors-table.component';

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [
    CommonModule,
    DistributorsFormComponent,
    DistributorsTableComponent,
  ],
  templateUrl: './distributors.component.html',
  styleUrl: './distributors.component.scss',
})
export class DistributorsComponent {}
