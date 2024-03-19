import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFreeNightComponent } from './list-free-night.component';

describe('ListFreeNightComponent', () => {
  let component: ListFreeNightComponent;
  let fixture: ComponentFixture<ListFreeNightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFreeNightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFreeNightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
