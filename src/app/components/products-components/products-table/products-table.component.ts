import {Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from "../../../shared/modules/material/material.module";
import {ProductsInterface} from "../../../shared/models";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {ProductsService} from "../products.service";

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent {
  constructor(private productsService: ProductsService) {}
  dataSource: MatTableDataSource<ProductsInterface> = new MatTableDataSource<ProductsInterface>(this.productsService.source.getValue())
  @ViewChild(MatPaginator) paginator: any;
  products: any;

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'ingredients',
    'delete',
    'edit'
  ];

  ngOnInit() {
    this.productsService.updateTable()
    this.productsService.source.subscribe((res: any) => {
      this.dataSource =  new MatTableDataSource<ProductsInterface>(res)
      this.dataSource.paginator = this.paginator;
    })
  }

  delete_item(employee: any):void {
    this.productsService.deleteProducts(employee.id).subscribe(() => this.productsService.updateTable())
  }

  edit_item(product: any):void {
    this.productsService.currentProductId$.next(product.id)
    this.productsService.show$.next(true)
    this.productsService.isInEditMode$.next(true)
    this.productsService.isInAddMode$.next(false)

    this.productsService.addForm.setValue({
      name: product.name,
      description: product.description,
      price: product.price,
      ingredients: product.ingredients
    })

    this.productsService.ingredients$.next(product.ingredientsId)
  }
}
