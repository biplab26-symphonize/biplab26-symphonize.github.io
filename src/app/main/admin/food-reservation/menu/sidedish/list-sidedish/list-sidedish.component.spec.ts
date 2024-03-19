import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSidedishComponent } from './list-sidedish.component';

describe('ListSidedishComponent', () => {
  let component: ListSidedishComponent;
  let fixture: ComponentFixture<ListSidedishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSidedishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSidedishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
