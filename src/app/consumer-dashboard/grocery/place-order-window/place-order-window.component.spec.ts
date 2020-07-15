import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceOrderWindowComponent } from './place-order-window.component';

describe('PlaceOrderWindowComponent', () => {
  let component: PlaceOrderWindowComponent;
  let fixture: ComponentFixture<PlaceOrderWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceOrderWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceOrderWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
