import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteEventComponent } from './favorite-event.component';

describe('FavoriteEventComponent', () => {
  let component: FavoriteEventComponent;
  let fixture: ComponentFixture<FavoriteEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
