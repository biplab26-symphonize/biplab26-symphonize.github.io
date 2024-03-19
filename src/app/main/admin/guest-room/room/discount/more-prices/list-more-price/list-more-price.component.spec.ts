import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMorePriceComponent } from './list-more-price.component';

describe('ListMorePriceComponent', () => {
  let component: ListMorePriceComponent;
  let fixture: ComponentFixture<ListMorePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMorePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMorePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
