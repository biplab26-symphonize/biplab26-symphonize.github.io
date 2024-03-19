import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalLogicComponent } from './conditional-logic.component';

describe('ConditionalLogicComponent', () => {
  let component: ConditionalLogicComponent;
  let fixture: ComponentFixture<ConditionalLogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionalLogicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionalLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
