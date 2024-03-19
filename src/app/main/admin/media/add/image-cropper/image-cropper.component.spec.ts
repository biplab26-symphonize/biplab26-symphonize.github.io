import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperComponents } from './image-cropper.component';

describe('ImageCropperComponent', () => {
  let component: ImageCropperComponents;
  let fixture: ComponentFixture<ImageCropperComponents>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCropperComponents ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
