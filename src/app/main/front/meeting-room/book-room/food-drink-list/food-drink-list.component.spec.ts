import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDrinkListComponent } from './food-drink-list.component';

describe('FoodDrinkListComponent', () => {
  let component: FoodDrinkListComponent;
  let fixture: ComponentFixture<FoodDrinkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodDrinkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodDrinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
