import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerySettingsComponent } from './gallery-settings.component';

describe('GallerySettingsComponent', () => {
  let component: GallerySettingsComponent;
  let fixture: ComponentFixture<GallerySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallerySettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
