import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpFormComponent } from './sp-form.component';

describe('SpFormComponent', () => {
  let component: SpFormComponent;
  let fixture: ComponentFixture<SpFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
