import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ProductsInterface} from "../../../shared/models";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  isInEditMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isInAddMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  show$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentProductId$: BehaviorSubject<number> = new BehaviorSubject(0);
  source: BehaviorSubject<any> = new BehaviorSubject({});
  ingredients$: BehaviorSubject<any> = new BehaviorSubject("");

  addForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    price: new FormControl('', [Validators.required]),
    ingredients: new FormControl('', [Validators.required]),
  });

  url = 'http://localhost:8082'
  constructor(private httpClient: HttpClient) {}

  getProducts() {
    return this.httpClient.get(`${this.url}/products`)
  }

  getIngredients(){
    return this.httpClient.get(`${this.url}/ingredients`)
  }

  // getProductIngredients(productId: number) {
  //   return this.httpClient.get(`${this.url}/ingredients/${productId}`)
  // }

  updateTable(){
    this.getProducts().subscribe((result: any) => {
      this.source.next(result.items)
    })
  }

  getProduct(productId: number){
    return this.httpClient.get(`${this.url}/products/${productId}`)
  }

  editProducts(productId: number, productDetails: any) {
    return this.httpClient.put(`${this.url}/products/${productId}`, productDetails)
  }

  deleteProducts(productId: number) {
    return this.httpClient.delete( `${this.url}/products/${productId}`)
  }

  addProducts(product: any){
    return this.httpClient.post(`${this.url}/products`, product);
  }
}
