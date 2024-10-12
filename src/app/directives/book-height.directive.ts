import {
  Directive,
  inject,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appBookHeight]',
  standalone: true,
})
export class BookHeightDirective implements AfterViewInit, OnDestroy {
  el = inject(ElementRef);
  resizeObserver!: () => void;

  ngAfterViewInit(): void {
    const updateHeight = () => {
      const book = this.el.nativeElement;
      const container = book.closest('#jarallaxContainer');
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;

      let bookHeight: number;

      // Height calculation based on width and container height
      if (containerWidth < 780) {
        bookHeight = containerHeight * 0.3; // 30% of container height
      } else {
        // For widths >= 780px
        bookHeight = (containerHeight / 1200) * 500; // Scale height based on container height
      }

      book.style.height = `${bookHeight}px`;
    };

    updateHeight(); // Initial height calculation
    window.addEventListener('resize', updateHeight);
    this.resizeObserver = updateHeight; // Store reference for cleanup
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeObserver);
  }
}
