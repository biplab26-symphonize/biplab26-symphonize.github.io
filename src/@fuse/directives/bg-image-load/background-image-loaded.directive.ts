import { Directive, Input,  Output, EventEmitter, ElementRef } from '@angular/core';

@Directive({
  selector: '[appBackgroundImageLoaded]'
})
export class BackgroundImageLoadedDirective {
  @Output() imageLoaded: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const img = new Image();
    const bgStyle = getComputedStyle(this.el.nativeElement).backgroundImage
    const src = bgStyle.replace(/(^url\()|(\)$|[\"\'])/g, '');
    img.src = src;
    img.addEventListener('load', ()=> {
      this.imageLoaded.emit(true);
    });
  }
}