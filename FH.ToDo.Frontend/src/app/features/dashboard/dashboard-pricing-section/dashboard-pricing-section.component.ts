import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard-pricing-section',
  templateUrl: './dashboard-pricing-section.component.html',
  styleUrl: './dashboard-pricing-section.component.scss',
  imports: [MatButtonModule, MatCardModule, MatListModule, MatIconModule],
})
export class DashboardPricingSectionComponent {}
