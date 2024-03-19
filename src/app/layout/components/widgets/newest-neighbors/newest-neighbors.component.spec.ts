import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewestNeighborsComponent } from './newest-neighbors.component';

describe('NewestNeighborsComponent', () => {
  let component: NewestNeighborsComponent;
  let fixture: ComponentFixture<NewestNeighborsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewestNeighborsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewestNeighborsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
