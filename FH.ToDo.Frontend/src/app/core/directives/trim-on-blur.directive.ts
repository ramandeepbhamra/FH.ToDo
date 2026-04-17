import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directive that trims leading and trailing whitespace from a text input on blur.
 * 
 * Apply as attribute directive to any text input that should auto-trim whitespace.
 * Commonly used on FirstName and LastName fields to prevent accidental spaces.
 * 
 * @example
 * ```html
 * <input trimOnBlur formControlName="firstName" />
 * <input trimOnBlur formControlName="lastName" />
 * ```
 */
@Directive({
  selector: 'input[trimOnBlur]',
})
export class TrimOnBlurDirective {
  private readonly control = inject(NgControl, { optional: true, self: true });

  /**
   * Trims the control value when the input loses focus.
   * Only processes string values and sets the trimmed value without emitting events.
   */
  @HostListener('blur')
  onBlur(): void {
    const value = this.control?.control?.value;
    if (typeof value === 'string') {
      this.control!.control!.setValue(value.trim(), { emitEvent: false });
    }
  }
}
