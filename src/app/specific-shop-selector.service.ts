import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpecificShopSelectorService {

  constructor() { }

  data = {
    id: null,
    shopName: null,
    shopAddress: null
  };
}
