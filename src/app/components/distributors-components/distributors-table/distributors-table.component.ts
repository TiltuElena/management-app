import {Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DistributorsInterface} from "../../../shared/models";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MaterialModule} from "../../../shared/modules/material/material.module";

@Component({
  selector: 'app-distributors-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './distributors-table.component.html',
  styleUrl: './distributors-table.component.scss'
})
export class DistributorsTableComponent {
  @ViewChild(MatPaginator) paginator: any;

  clickedRows = new Set<DistributorsInterface>();
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'phone',
    'email',
    'distributed_product',
    'edit',
    'delete',
  ];
  dataSource = new MatTableDataSource<DistributorsInterface>(distributors);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  clicked_row(row: any) {
    console.log(row);
  }
}

const distributors: DistributorsInterface[] = [
  {
    id: 1,
    first_name: 'Doe',
    last_name: 'Joe',
    phone: '+373060214498',
    email: 'john.doe@gmail.com',
    distributed_product: 'Milk'
  },
  {
    id: 2,
    first_name: 'Smith',
    last_name: 'Anne',
    phone: '+373789214498',
    email: 'anne.smith@gmail.com',
    distributed_product: 'Coffee'
  },
  {
    id: 3,
    first_name: 'King',
    last_name: 'Mary',
    phone: '+373789214998',
    email: 'mary.king@gmail.com',
    distributed_product: 'Cheese'
  },
  {
    id: 4,
    first_name: 'Carsley',
    last_name: 'John',
    phone: '+373744444998',
    email: 'john.carsley@gmail.com',
    distributed_product: 'Lemons'
  },
  {
    id: 5,
    first_name: 'Great',
    last_name: 'Mark',
    phone: '+373799214998',
    email: 'mark.great@gmail.com',
    distributed_product: 'Water'
  },
  {
    id: 6,
    first_name: 'Doom',
    last_name: 'Helen',
    phone: '+373339214998',
    email: 'helen.doom@gmail.com',
    distributed_product: 'Fruits'
  },
  {
    id: 7,
    first_name: 'Meet',
    last_name: 'Hikaru',
    phone: '+373789214977',
    email: 'hikaru.meet@gmail.com',
    distributed_product: 'Flour'
  },
];
