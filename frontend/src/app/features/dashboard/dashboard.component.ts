import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { JobApplicationService } from '../../core/services/job-application.service';
import { JobApplication } from '../../core/models/job-application.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent, StatusBadgePipe],
  template: `
    <div class="dashboard-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard Overview</h1>
          <p class="page-subtitle">Real-time statistics and analytics from your database</p>
        </div>
        <div class="header-actions">
          <a routerLink="/applications" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ Add / View Applications</span>
          </a>
        </div>
      </div>

      <!-- Overview 6 Stat Cards Grid -->
      <div class="stats-grid">
        <app-stat-card title="Total Applications" [value]="stats.total" subtitle="All entries in database" themeClass="theme-indigo">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        </app-stat-card>

        <app-stat-card title="Applied" [value]="stats.applied" subtitle="Awaiting review" themeClass="theme-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </app-stat-card>

        <app-stat-card title="Shortlisted" [value]="stats.shortlisted" subtitle="Passed initial screen" themeClass="theme-purple">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </app-stat-card>

        <app-stat-card title="Interview" [value]="stats.interview" subtitle="Active rounds" themeClass="theme-amber">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </app-stat-card>

        <app-stat-card title="Selected" [value]="stats.selected" subtitle="Job offers received" themeClass="theme-emerald">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </app-stat-card>

        <app-stat-card title="Rejected" [value]="stats.rejected" subtitle="Archived decisions" themeClass="theme-rose">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        </app-stat-card>
      </div>

      <!-- Analytics Chart & Recent Applications Grid -->
      <div class="content-grid">
        <!-- Status Distribution Chart Card -->
        <div class="card chart-card">
          <div class="card-header">
            <h3>Status Distribution Breakdown</h3>
            <span class="chart-tag">{{ stats.total }} Total</span>
          </div>

          <div class="chart-container" *ngIf="stats.total > 0; else noChartData">
            <!-- Multi-color Segmented Progress Bar -->
            <div class="stacked-bar">
              <div class="bar-segment seg-applied" [style.width.%]="getPercent('applied')" title="Applied: {{ stats.applied }}"></div>
              <div class="bar-segment seg-shortlisted" [style.width.%]="getPercent('shortlisted')" title="Shortlisted: {{ stats.shortlisted }}"></div>
              <div class="bar-segment seg-interview" [style.width.%]="getPercent('interview')" title="Interview: {{ stats.interview }}"></div>
              <div class="bar-segment seg-selected" [style.width.%]="getPercent('selected')" title="Selected: {{ stats.selected }}"></div>
              <div class="bar-segment seg-rejected" [style.width.%]="getPercent('rejected')" title="Rejected: {{ stats.rejected }}"></div>
            </div>

            <!-- Detailed Bar Breakdown List -->
            <div class="status-chart-list">
              <div class="chart-row">
                <div class="status-info">
                  <span class="status-dot dot-applied"></span>
                  <span class="status-name">Applied</span>
                </div>
                <div class="bar-fill-track">
                  <div class="bar-fill fill-applied" [style.width.%]="getPercent('applied')"></div>
                </div>
                <span class="status-count">{{ stats.applied }} ({{ getPercent('applied') | number:'1.0-1' }}%)</span>
              </div>

              <div class="chart-row">
                <div class="status-info">
                  <span class="status-dot dot-shortlisted"></span>
                  <span class="status-name">Shortlisted</span>
                </div>
                <div class="bar-fill-track">
                  <div class="bar-fill fill-shortlisted" [style.width.%]="getPercent('shortlisted')"></div>
                </div>
                <span class="status-count">{{ stats.shortlisted }} ({{ getPercent('shortlisted') | number:'1.0-1' }}%)</span>
              </div>

              <div class="chart-row">
                <div class="status-info">
                  <span class="status-dot dot-interview"></span>
                  <span class="status-name">Interview</span>
                </div>
                <div class="bar-fill-track">
                  <div class="bar-fill fill-interview" [style.width.%]="getPercent('interview')"></div>
                </div>
                <span class="status-count">{{ stats.interview }} ({{ getPercent('interview') | number:'1.0-1' }}%)</span>
              </div>

              <div class="chart-row">
                <div class="status-info">
                  <span class="status-dot dot-selected"></span>
                  <span class="status-name">Selected</span>
                </div>
                <div class="bar-fill-track">
                  <div class="bar-fill fill-selected" [style.width.%]="getPercent('selected')"></div>
                </div>
                <span class="status-count">{{ stats.selected }} ({{ getPercent('selected') | number:'1.0-1' }}%)</span>
              </div>

              <div class="chart-row">
                <div class="status-info">
                  <span class="status-dot dot-rejected"></span>
                  <span class="status-name">Rejected</span>
                </div>
                <div class="bar-fill-track">
                  <div class="bar-fill fill-rejected" [style.width.%]="getPercent('rejected')"></div>
                </div>
                <span class="status-count">{{ stats.rejected }} ({{ getPercent('rejected') | number:'1.0-1' }}%)</span>
              </div>
            </div>
          </div>

          <ng-template #noChartData>
            <div class="empty-chart">
              <p>No applications recorded yet to plot statistics.</p>
              <a routerLink="/applications" class="btn btn-secondary">Add Your First Application</a>
            </div>
          </ng-template>
        </div>

        <!-- Recent Applications Sidebar Card -->
        <div class="card recent-card">
          <div class="card-header">
            <h3>Recent Applications</h3>
            <a routerLink="/applications" class="view-all-link">View All &rarr;</a>
          </div>

          <div class="recent-list" *ngIf="recentApps.length > 0; else noRecent">
            <div class="recent-item" *ngFor="let app of recentApps">
              <div class="recent-logo">{{ app.company.substring(0,2).toUpperCase() }}</div>
              <div class="recent-details">
                <div class="recent-company">{{ app.company }}</div>
                <div class="recent-role">{{ app.jobRole }}</div>
              </div>
              <span class="badge" [ngClass]="app.status | statusBadge">
                {{ app.status }}
              </span>
            </div>
          </div>

          <ng-template #noRecent>
            <div class="empty-recent">
              <p>No recent application activity.</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .page-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 1.5rem;
    }
    @media (max-width: 900px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
    .card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .card-header h3 {
      color: #f8fafc;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .chart-tag {
      font-size: 0.8rem;
      color: #94a3b8;
      background: rgba(15, 23, 42, 0.6);
      padding: 0.25rem 0.65rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .stacked-bar {
      height: 12px;
      border-radius: 6px;
      background: rgba(15, 23, 42, 0.8);
      display: flex;
      overflow: hidden;
      margin-bottom: 1.75rem;
    }
    .bar-segment { height: 100%; transition: width 0.5s ease; }
    .seg-applied { background: #60a5fa; }
    .seg-shortlisted { background: #c084fc; }
    .seg-interview { background: #fbbf24; }
    .seg-selected { background: #34d399; }
    .seg-rejected { background: #f87171; }

    .status-chart-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .chart-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .status-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 110px;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot-applied { background: #60a5fa; box-shadow: 0 0 6px #60a5fa; }
    .dot-shortlisted { background: #c084fc; box-shadow: 0 0 6px #c084fc; }
    .dot-interview { background: #fbbf24; box-shadow: 0 0 6px #fbbf24; }
    .dot-selected { background: #34d399; box-shadow: 0 0 6px #34d399; }
    .dot-rejected { background: #f87171; box-shadow: 0 0 6px #f87171; }

    .status-name { font-size: 0.88rem; color: #cbd5e1; font-weight: 500; }
    .bar-fill-track {
      flex: 1;
      height: 8px;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 4px;
      overflow: hidden;
    }
    .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
    .fill-applied { background: #60a5fa; }
    .fill-shortlisted { background: #c084fc; }
    .fill-interview { background: #fbbf24; }
    .fill-selected { background: #34d399; }
    .fill-rejected { background: #f87171; }

    .status-count {
      font-size: 0.85rem;
      color: #94a3b8;
      width: 90px;
      text-align: right;
      font-weight: 600;
    }

    .recent-list { display: flex; flex-direction: column; gap: 0.85rem; }
    .recent-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }
    .recent-logo {
      width: 36px; height: 36px; border-radius: 8px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white; font-weight: 700; font-size: 0.85rem;
      display: flex; align-items: center; justify-content: center;
    }
    .recent-details { flex: 1; display: flex; flex-direction: column; }
    .recent-company { color: #f8fafc; font-weight: 600; font-size: 0.9rem; }
    .recent-role { color: #64748b; font-size: 0.78rem; }
    .view-all-link { color: #818cf8; text-decoration: none; font-size: 0.85rem; font-weight: 500; }
    .view-all-link:hover { text-decoration: underline; }

    .empty-chart, .empty-recent {
      text-align: center;
      padding: 2.5rem 1rem;
      color: #94a3b8;
    }
    .empty-chart p, .empty-recent p { margin-bottom: 1rem; font-size: 0.9rem; }

    .btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.65rem 1.25rem; border-radius: 10px; font-weight: 600; font-size: 0.9rem;
      text-decoration: none; transition: all 0.2s ease;
    }
    .btn-primary { background: #6366f1; color: white; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35); }
    .btn-primary:hover { background: #4f46e5; }
    .btn-secondary { background: rgba(255, 255, 255, 0.08); color: #cbd5e1; }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    total: 0,
    applied: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0
  };

  recentApps: JobApplication[] = [];

  constructor(private jobService: JobApplicationService) {}

  ngOnInit(): void {
    this.jobService.getJobs().subscribe((apps: JobApplication[]) => {
      if (apps && apps.length > 0) {
        this.recentApps = apps.slice(0, 5);
        this.stats.total = apps.length;
        this.stats.applied = apps.filter(a => a.status?.toLowerCase() === 'applied').length;
        this.stats.shortlisted = apps.filter(a => a.status?.toLowerCase() === 'shortlisted').length;
        this.stats.interview = apps.filter(a => a.status?.toLowerCase() === 'interview' || a.status?.toLowerCase() === 'interviewing').length;
        this.stats.selected = apps.filter(a => a.status?.toLowerCase() === 'selected' || a.status?.toLowerCase() === 'offered').length;
        this.stats.rejected = apps.filter(a => a.status?.toLowerCase() === 'rejected').length;
      }
    });
  }

  getPercent(key: keyof typeof this.stats): number {
    if (this.stats.total === 0 || key === 'total') return 0;
    return (this.stats[key] / this.stats.total) * 100;
  }
}
