import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductsFormComponent} from "../../components/products-components/products-form/products-form.component";
import {ProductsTableComponent} from "../../components/products-components/products-table/products-table.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductsFormComponent, ProductsTableComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

}
