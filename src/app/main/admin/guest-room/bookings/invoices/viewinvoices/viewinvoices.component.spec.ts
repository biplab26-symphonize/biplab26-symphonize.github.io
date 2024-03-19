import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewinvoicesComponent } from './viewinvoices.component';

describe('ViewinvoicesComponent', () => {
  let component: ViewinvoicesComponent;
  let fixture: ComponentFixture<ViewinvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewinvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
