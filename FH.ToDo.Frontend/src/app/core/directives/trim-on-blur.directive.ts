import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Trims leading and trailing whitespace from a text input on blur.
 * Apply as attribute: <input trimOnBlur ... />
 */
@Directive({
  selector: 'input[trimOnBlur]',
})
export class TrimOnBlurDirective {
  private readonly control = inject(NgControl, { optional: true, self: true });

  @HostListener('blur')
  onBlur(): void {
    const value = this.control?.control?.value;
    if (typeof value === 'string') {
      this.control!.control!.setValue(value.trim(), { emitEvent: false });
    }
  }
}
