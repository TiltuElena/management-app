import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { ProductsInterface } from '../../../../shared/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss',
})
export class ProductsTableComponent {
  constructor(private productsService: ProductsService) {}
  dataSource: MatTableDataSource<ProductsInterface> =
    new MatTableDataSource<ProductsInterface>(
      this.productsService.source.getValue(),
    );
  @ViewChild(MatPaginator) paginator: any;
  products: any;

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
      if (res) {
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

  delete_item(product: any): void {
    console.log(product);
    this.productsService
      .deleteProducts(product.id)
      .subscribe(() => this.productsService.updateTable());
  }

  edit_item(product: any): void {
    this.productsService.getProduct(product.id).subscribe((product: any) => {
      console.log(product);
      this.productsService.ingredients$.next(product.ingredients);
    });

    this.productsService.currentProductId$.next(product.id);
    this.productsService.show$.next(true);
    this.productsService.isInEditMode$.next(true);
    this.productsService.isInAddMode$.next(false);

    this.productsService.addForm.setValue({
      name: product.name,
      description: product.description,
      price: product.price,
      ingredients: product.ingredients,
    });
  }
}
