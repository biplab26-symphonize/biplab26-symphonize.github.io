import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRotatingMenuComponent } from './add-rotating-menu.component';


describe('AddRoutatingMenuComponent', () => {
  let component: AddRotatingMenuComponent;
  let fixture: ComponentFixture<AddRotatingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRotatingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRotatingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
