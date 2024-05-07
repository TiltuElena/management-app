import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { ProductsInterface } from '../../../../shared/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductsService } from '../../services/products.service';
import { MdlCurrencyPipe } from '../../../../shared/pipes/mdl-currency.pipe';
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, MdlCurrencyPipe],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss',
})
export class ProductsTableComponent {
  constructor(private productsService: ProductsService) {}

  dataSource: any = new MatTableDataSource(
    Array.isArray(this.productsService.source.getValue()) ? this.productsService.source.getValue() : [],
  );
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'ingredients',
    'delete',
    'edit',
  ];

  ngOnInit() {
    this.productsService.updateTable();
    this.productsService.source.subscribe((res: any) => {
      if (Array.isArray(res)) {
        const data = res.map((item: any) => {
          const ingredients = item.ingredients.map(
            (ingredient: any) => ingredient.name,
          );
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            ingredients: ingredients.join(', '),
          };
        });

        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  delete_item(product: any): void {
    console.log(product);
    this.productsService
      .deleteProducts(product.id)
      .subscribe(() => this.productsService.updateTable());
  }

  edit_item(product: any): void {
    let ingredients: string[] = [];

    this.productsService.getProduct(product.id).subscribe((product: any) => {
      if (Array.isArray(product.ingredients)) {
        ingredients = product.ingredients.map((ingredient: any) => {
          return ingredient.id.toString();
        });
        let names =  product.ingredients.map((ingredient: any) => {
          return ingredient.name;
        });
        // this.productsService.ingredients$.next(ingredients);
        this.productsService.addForm.setValue({
          name: product.name,
          description: product.description,
          price: product.price,
          ingredients: ingredients,
        });
      }
    });

    this.productsService.currentProductId$.next(product.id);
    this.productsService.show$.next(true);
    this.productsService.isInEditMode$.next(true);
    this.productsService.isInAddMode$.next(false);
  }
}
