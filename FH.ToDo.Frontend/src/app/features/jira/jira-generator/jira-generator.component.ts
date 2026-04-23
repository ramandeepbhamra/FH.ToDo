import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JiraService } from '../services/jira.service';
import { GenerateTestCasesResponse } from '../models/generate-test-cases-response.model';

@Component({
  selector: 'app-jira-generator',
  templateUrl: './jira-generator.component.html',
  styleUrl: './jira-generator.component.scss',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
  ],
})
export class JiraGeneratorComponent {
  private readonly jiraService = inject(JiraService);
  private readonly snackBar    = inject(MatSnackBar);

  readonly formats = ['BDD', 'StepByStep', 'Markdown'] as const;

  readonly ticketNumber = signal('');
  readonly format       = signal<string>('BDD');
  readonly loading      = signal(false);
  readonly result       = signal<GenerateTestCasesResponse | null>(null);
  readonly copied       = signal(false);

  readonly ticketError = signal(false);

  readonly canGenerate = computed(
    () => this.ticketNumber().trim().length > 0 && !this.loading(),
  );

  generate(): void {
    if (!this.canGenerate()) {
      this.triggerError(this.ticketError, 'Please enter a Jira ticket number.');
      return;
    }

    this.loading.set(true);
    this.result.set(null);

    this.jiraService
      .generateTestCases({
        jiraTicketNumber: this.ticketNumber().trim().toUpperCase(),
        outputFormat: this.format(),
      })
      .subscribe({
        next: res => {
          this.result.set(res);
          this.loading.set(false);
        },
        error: err => {
          const message = err.error?.message ?? 'Failed to generate test cases. Please try again.';
          this.triggerError(this.ticketError, message);
          this.loading.set(false);
        },
      });
  }

  copyToClipboard(): void {
    const text = this.result()?.testCases;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  reset(): void {
    this.result.set(null);
    this.ticketNumber.set('');
  }

  private triggerError(sig: WritableSignal<boolean>, message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    sig.set(true);
    setTimeout(() => sig.set(false), 600);
  }
}
