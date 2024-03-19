import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupDeliveryComponent } from './pickup-delivery.component';

describe('PickupDeliveryComponent', () => {
  let component: PickupDeliveryComponent;
  let fixture: ComponentFixture<PickupDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
