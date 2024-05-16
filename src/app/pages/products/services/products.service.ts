import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@/services/http/http.service';
import { ProductsInterface } from '@/shared/models';
import { ApiRoutes } from '@/ts/enums';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  isInEditMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isInAddMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  show$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentProductId$: BehaviorSubject<number> = new BehaviorSubject(0);
  source: BehaviorSubject<any> = new BehaviorSubject({});

  addForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    price: new FormControl('', [Validators.required]),
    ingredients: new FormControl([], [Validators.required]),
  });

  constructor(private httpClient: HttpService) {}

  getProducts() {
    return this.httpClient.get(ApiRoutes.Products);
  }

  getIngredients() {
    return this.httpClient.get(ApiRoutes.Ingredients);
  }

  updateTable() {
    this.getProducts().subscribe((result: any) => {
      this.source.next(result.items);
    });
  }

  getProduct(productId: number) {
    return this.httpClient.get(`${ApiRoutes.Products}/${productId}`);
  }

  editProducts(productId: number, productDetails: any) {
    return this.httpClient.put(
      `${ApiRoutes.Products}/${productId}`,
      productDetails,
    );
  }

  deleteProducts(productId: number) {
    return this.httpClient.delete(`${ApiRoutes.Products}/${productId}`);
  }

  addProducts(product: any) {
    return this.httpClient.post(ApiRoutes.Products, product);
  }
}
