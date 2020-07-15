import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrocerydashboardComponent } from './grocerydashboard.component';

describe('GrocerydashboardComponent', () => {
  let component: GrocerydashboardComponent;
  let fixture: ComponentFixture<GrocerydashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrocerydashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrocerydashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
