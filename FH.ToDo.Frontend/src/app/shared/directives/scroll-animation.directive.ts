import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[scrollAnimation]',
  standalone: true,
})
export class ScrollAnimationDirective implements OnInit {
  @Input() animationClass = 'fade-in-up';
  @Input() threshold = 0.2;
  @Input() delay = 0;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.element.nativeElement.style.opacity = '0';
    this.element.nativeElement.style.transition = 'all 0.8s ease';
    this.element.nativeElement.style.transitionDelay = `${this.delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.element.nativeElement.style.opacity = '1';
            this.element.nativeElement.classList.add(this.animationClass);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: this.threshold }
    );

    observer.observe(this.element.nativeElement);
  }
}
