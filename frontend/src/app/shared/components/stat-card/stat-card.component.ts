import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [ngClass]="themeClass">
      <div class="stat-header">
        <span class="stat-title">{{ title }}</span>
        <div class="stat-icon">
          <ng-content></ng-content>
        </div>
      </div>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-subtitle" *ngIf="subtitle">{{ subtitle }}</div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.3);
    }
    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .stat-title {
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .stat-subtitle {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 0.4rem;
    }
    .theme-indigo .stat-icon { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .theme-blue .stat-icon { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .theme-emerald .stat-icon { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .theme-amber .stat-icon { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .theme-rose .stat-icon { background: rgba(244, 63, 94, 0.15); color: #f87171; }
  `]
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() subtitle?: string;
  @Input() themeClass: string = 'theme-indigo';
}
