import { FormControl } from '@angular/forms';

export interface UserForm {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<string | null>;
  password: FormControl<string | null>;
  isActive: FormControl<boolean>;
}
