import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFreeNightComponent } from './add-free-night.component';

describe('AddFreeNightComponent', () => {
  let component: AddFreeNightComponent;
  let fixture: ComponentFixture<AddFreeNightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFreeNightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFreeNightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
