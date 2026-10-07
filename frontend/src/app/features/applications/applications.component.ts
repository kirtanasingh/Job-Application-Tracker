import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { JobApplicationService } from '../../core/services/job-application.service';
import { JobApplication } from '../../core/models/job-application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, StatusBadgePipe],
  template: `
    <div class="applications-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Job Applications</h1>
          <p class="page-subtitle">Manage, track, and update all your job application statuses</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary btn-add" (click)="openAddModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ Add Application</span>
          </button>
        </div>
      </div>

      <!-- Controls & Filters Card -->
      <div class="controls-card">
        <!-- Search Box -->
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="onFilterChange()" 
            placeholder="Search by company or job role..." 
            class="search-input" 
          />
        </div>

        <div class="filter-group">
          <!-- Status Dropdown Filter -->
          <div class="filter-item">
            <label class="filter-label">Status:</label>
            <select [(ngModel)]="selectedStatus" (change)="onFilterChange()" class="filter-select">
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <!-- Job Type Dropdown Filter -->
          <div class="filter-item">
            <label class="filter-label">Job Type:</label>
            <select [(ngModel)]="selectedJobType" (change)="onFilterChange()" class="filter-select">
              <option value="All">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <button class="btn btn-secondary btn-icon" (click)="resetFilters()" title="Reset Filters">
            ↻ Reset
          </button>
        </div>
      </div>

      <!-- Applications Table Card -->
      <div class="table-card">
        <div class="table-header-info">
          <h2>Applications List ({{ filteredApplications.length }})</h2>
          <span class="db-badge">
            <span class="db-dot"></span> Database Connected
          </span>
        </div>

        <div class="table-responsive" *ngIf="filteredApplications.length > 0; else emptyState">
          <table class="applications-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Location</th>
                <th>Date</th>
                <th>Job Type</th>
                <th>Status</th>
                <th>Salary</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let app of filteredApplications">
                <td class="company-cell">
                  <div class="company-logo-avatar">{{ getInitials(app.company) }}</div>
                  <strong class="company-name">{{ app.company }}</strong>
                </td>
                <td class="role-cell">{{ app.jobRole }}</td>
                <td>{{ app.location || 'Remote / Unspecified' }}</td>
                <td>{{ app.applicationDate | date:'mediumDate' }}</td>
                <td><span class="type-pill">{{ app.jobType }}</span></td>
                <td>
                  <span class="badge" [ngClass]="app.status | statusBadge">
                    {{ app.status }}
                  </span>
                </td>
                <td class="salary-cell">
                  {{ app.salary ? ('$' + (app.salary | number:'1.0-2')) : 'N/A' }}
                </td>
                <td class="actions-cell">
                  <button class="action-btn view-btn" (click)="openViewModal(app)" title="View Details">
                    👁 View
                  </button>
                  <button class="action-btn edit-btn" (click)="openEditModal(app)" title="Edit Application">
                    ✏️ Edit
                  </button>
                  <button class="action-btn delete-btn" (click)="confirmDelete(app)" title="Delete Application">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <div class="empty-icon">📂</div>
            <h3>No Applications Found</h3>
            <p *ngIf="applications.length === 0; else noMatches">
              You haven't added any job applications yet. Click <strong>"+ Add Application"</strong> to create your first entry!
            </p>
            <ng-template #noMatches>
              <p>No job applications match your current search and filter criteria.</p>
            </ng-template>
            <button class="btn btn-primary" (click)="openAddModal()" *ngIf="applications.length === 0">
              + Add First Application
            </button>
          </div>
        </ng-template>
      </div>

      <!-- Add / Edit Application Modal -->
      <div class="modal-backdrop" *ngIf="isFormModalOpen" (click)="closeFormModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ isEditMode ? 'Edit Job Application' : 'Add New Job Application' }}</h2>
            <button class="modal-close-btn" (click)="closeFormModal()">&times;</button>
          </div>

          <form [formGroup]="jobForm" (ngSubmit)="saveApplication()" class="modal-body">
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Company Name <span class="required">*</span></label>
                <input 
                  type="text" 
                  formControlName="company" 
                  placeholder="e.g. Google, Microsoft, Meta" 
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('company')"
                />
                <div class="invalid-feedback" *ngIf="isFieldInvalid('company')">
                  Company Name is required.
                </div>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Job Role <span class="required">*</span></label>
                <input 
                  type="text" 
                  formControlName="jobRole" 
                  placeholder="e.g. Senior Software Engineer" 
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('jobRole')"
                />
                <div class="invalid-feedback" *ngIf="isFieldInvalid('jobRole')">
                  Job Role is required.
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Location</label>
                <input 
                  type="text" 
                  formControlName="location" 
                  placeholder="e.g. New York, NY (or Remote)" 
                  class="form-control"
                />
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Application Date <span class="required">*</span></label>
                <input 
                  type="date" 
                  formControlName="applicationDate" 
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('applicationDate')"
                />
                <div class="invalid-feedback" *ngIf="isFieldInvalid('applicationDate')">
                  Application Date is required.
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Job Type <span class="required">*</span></label>
                <select formControlName="jobType" class="form-control" [class.is-invalid]="isFieldInvalid('jobType')">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
                <div class="invalid-feedback" *ngIf="isFieldInvalid('jobType')">
                  Job Type is required.
                </div>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Status <span class="required">*</span></label>
                <select formControlName="status" class="form-control" [class.is-invalid]="isFieldInvalid('status')">
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <div class="invalid-feedback" *ngIf="isFieldInvalid('status')">
                  Status is required.
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Salary / Package ($)</label>
                <input 
                  type="number" 
                  formControlName="salary" 
                  placeholder="e.g. 120000" 
                  class="form-control"
                />
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Job URL</label>
                <input 
                  type="url" 
                  formControlName="jobUrl" 
                  placeholder="https://company.com/careers/job" 
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Notes / Next Steps</label>
              <textarea 
                formControlName="notes" 
                rows="3" 
                placeholder="Add interview notes, recruiter contacts, or follow-up tasks..." 
                class="form-control textarea"
              ></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeFormModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">
                {{ isEditMode ? 'Update Application' : 'Save Application' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Details Modal -->
      <div class="modal-backdrop" *ngIf="isViewModalOpen" (click)="closeViewModal()">
        <div class="modal-dialog modal-dialog-view" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="view-header-title">
              <div class="company-logo-avatar large">{{ getInitials(selectedApp?.company || '') }}</div>
              <div>
                <h2>{{ selectedApp?.company }}</h2>
                <p class="view-subtitle">{{ selectedApp?.jobRole }}</p>
              </div>
            </div>
            <button class="modal-close-btn" (click)="closeViewModal()">&times;</button>
          </div>

          <div class="modal-body view-body" *ngIf="selectedApp">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="badge" [ngClass]="selectedApp.status | statusBadge">{{ selectedApp.status }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Job Type</span>
                <span class="detail-value">{{ selectedApp.jobType }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Location</span>
                <span class="detail-value">{{ selectedApp.location || 'Remote / Unspecified' }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Applied Date</span>
                <span class="detail-value">{{ selectedApp.applicationDate | date:'fullDate' }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Salary / Compensation</span>
                <span class="detail-value highlight">{{ selectedApp.salary ? ('$' + (selectedApp.salary | number:'1.0-2')) : 'Not specified' }}</span>
              </div>

              <div class="detail-item" *ngIf="selectedApp.jobUrl">
                <span class="detail-label">Job Listing URL</span>
                <a [href]="selectedApp.jobUrl" target="_blank" rel="noopener" class="detail-link">
                  🔗 Open External Job Posting
                </a>
              </div>
            </div>

            <div class="notes-box" *ngIf="selectedApp.notes">
              <h4>Notes & Information</h4>
              <p>{{ selectedApp.notes }}</p>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeViewModal()">Close</button>
              <button class="btn btn-primary" (click)="switchEditFromView()">Edit Application</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-backdrop" *ngIf="isDeleteModalOpen" (click)="closeDeleteModal()">
        <div class="modal-dialog modal-dialog-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Confirm Delete</h2>
            <button class="modal-close-btn" (click)="closeDeleteModal()">&times;</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the job application for <strong>{{ appToDelete?.jobRole }}</strong> at <strong>{{ appToDelete?.company }}</strong>?</p>
            <p class="warning-text">This action cannot be undone in the database.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeDeleteModal()">Cancel</button>
            <button class="btn btn-danger" (click)="deleteApplication()">Delete Application</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .applications-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: #f8fafc; letter-spacing: -0.02em; }
    .page-subtitle { color: #94a3b8; font-size: 0.95rem; margin-top: 0.25rem; }
    .btn-add { font-size: 0.95rem; padding: 0.75rem 1.4rem; }

    .controls-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
    }
    .search-box { position: relative; flex: 1; min-width: 280px; }
    .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #64748b; }
    .search-input {
      width: 100%; padding: 0.65rem 1rem 0.65rem 2.75rem;
      background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px; color: #f8fafc; font-size: 0.9rem;
    }
    .search-input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25); }
    .filter-group { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .filter-item { display: flex; align-items: center; gap: 0.5rem; }
    .filter-label { color: #94a3b8; font-size: 0.85rem; font-weight: 500; }
    .filter-select {
      padding: 0.55rem 0.85rem; border-radius: 8px;
      background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f8fafc; font-size: 0.85rem; cursor: pointer;
    }

    .table-card {
      background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.5rem;
    }
    .table-header-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
    .table-header-info h2 { color: #f8fafc; font-size: 1.15rem; font-weight: 600; }
    .db-badge {
      font-size: 0.8rem; padding: 0.35rem 0.75rem; border-radius: 20px;
      background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);
      display: flex; align-items: center; gap: 0.4rem;
    }
    .db-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 6px #34d399; }
    .table-responsive { overflow-x: auto; }
    .applications-table { width: 100%; border-collapse: collapse; text-align: left; }
    .applications-table th { padding: 0.9rem 1rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .applications-table td { padding: 1rem; color: #cbd5e1; font-size: 0.9rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); vertical-align: middle; }
    .company-cell { display: flex; align-items: center; gap: 0.75rem; }
    .company-logo-avatar {
      width: 34px; height: 34px; border-radius: 8px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;
    }
    .company-name { color: #f8fafc; font-size: 0.95rem; }
    .role-cell { font-weight: 500; color: #e2e8f0; }
    .type-pill { background: rgba(255, 255, 255, 0.06); padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.8rem; color: #cbd5e1; }
    .salary-cell { font-weight: 600; color: #34d399; }

    .badge { display: inline-block; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .badge-applied { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .badge-shortlisted { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
    .badge-interview { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-selected { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-rejected { background: rgba(244, 63, 94, 0.2); color: #f87171; border: 1px solid rgba(244, 63, 94, 0.3); }
    .badge-default { background: rgba(255, 255, 255, 0.1); color: #cbd5e1; }

    .action-btn { padding: 0.35rem 0.65rem; border-radius: 6px; font-size: 0.8rem; font-weight: 500; cursor: pointer; border: none; margin-left: 0.35rem; transition: all 0.2s ease; }
    .view-btn { background: rgba(255, 255, 255, 0.08); color: #e2e8f0; }
    .view-btn:hover { background: rgba(255, 255, 255, 0.15); }
    .edit-btn { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .edit-btn:hover { background: rgba(99, 102, 241, 0.25); }
    .delete-btn { background: rgba(244, 63, 94, 0.15); color: #f87171; }
    .delete-btn:hover { background: rgba(244, 63, 94, 0.25); }

    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; }
    .empty-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .empty-state h3 { color: #f8fafc; font-size: 1.25rem; margin-bottom: 0.5rem; }
    .empty-state p { color: #94a3b8; font-size: 0.9rem; max-width: 450px; margin-bottom: 1.5rem; }

    .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .modal-dialog { background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .modal-dialog-sm { max-width: 440px; }
    .modal-dialog-view { max-width: 600px; }
    .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { font-size: 1.25rem; font-weight: 700; color: #f8fafc; }
    .modal-close-btn { background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; }
    .modal-close-btn:hover { color: #ffffff; }
    .modal-body { padding: 1.5rem; }

    .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .flex-1 { flex: 1; min-width: 240px; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
    .form-label { font-size: 0.85rem; font-weight: 600; color: #cbd5e1; }
    .required { color: #f87171; }
    .form-control { width: 100%; padding: 0.65rem 0.9rem; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px; color: #f8fafc; font-size: 0.9rem; }
    .form-control:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25); }
    .form-control.is-invalid { border-color: #f87171; }
    .invalid-feedback { font-size: 0.78rem; color: #f87171; }
    .textarea { resize: vertical; }

    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 600; font-size: 0.88rem; cursor: pointer; border: none; transition: all 0.2s ease; }
    .btn-primary { background: #6366f1; color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
    .btn-primary:hover { background: #4f46e5; }
    .btn-secondary { background: rgba(255, 255, 255, 0.08); color: #cbd5e1; }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); color: #ffffff; }
    .btn-danger { background: #ef4444; color: white; }
    .btn-danger:hover { background: #dc2626; }

    .view-header-title { display: flex; align-items: center; gap: 1rem; }
    .company-logo-avatar.large { width: 48px; height: 48px; font-size: 1.1rem; border-radius: 12px; }
    .view-subtitle { color: #94a3b8; font-size: 0.9rem; margin-top: 0.15rem; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem; }
    .detail-item { display: flex; flex-direction: column; gap: 0.3rem; }
    .detail-label { font-size: 0.78rem; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.05em; }
    .detail-value { font-size: 0.95rem; color: #f8fafc; }
    .detail-value.highlight { color: #34d399; font-weight: 600; font-size: 1.1rem; }
    .detail-link { color: #818cf8; text-decoration: none; font-size: 0.9rem; }
    .detail-link:hover { text-decoration: underline; }
    .notes-box { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 1rem; }
    .notes-box h4 { font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.5rem; text-transform: uppercase; }
    .notes-box p { color: #e2e8f0; font-size: 0.9rem; line-height: 1.5; white-space: pre-wrap; }
    .warning-text { color: #f87171; font-size: 0.85rem; margin-top: 0.5rem; }
  `]
})
export class ApplicationsComponent implements OnInit {
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];
  
  searchQuery: string = '';
  selectedStatus: string = 'All';
  selectedJobType: string = 'All';

  isFormModalOpen: boolean = false;
  isViewModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  isEditMode: boolean = false;

  selectedApp: JobApplication | null = null;
  appToDelete: JobApplication | null = null;

  jobForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobService: JobApplicationService
  ) {
    this.jobForm = this.fb.group({
      id: [null],
      company: ['', [Validators.required]],
      jobRole: ['', [Validators.required]],
      location: [''],
      applicationDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      jobType: ['Full-time', [Validators.required]],
      status: ['Applied', [Validators.required]],
      salary: [null],
      jobUrl: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.jobService.getJobs(this.searchQuery, this.selectedStatus, this.selectedJobType).subscribe(data => {
      this.applications = data || [];
      this.applyLocalFilters();
    });
  }

  onFilterChange(): void {
    this.applyLocalFilters();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'All';
    this.selectedJobType = 'All';
    this.loadApplications();
  }

  applyLocalFilters(): void {
    this.filteredApplications = this.applications.filter(app => {
      const matchesSearch = !this.searchQuery ||
        app.company?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        app.jobRole?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        app.location?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.selectedStatus === 'All' ||
        app.status?.toLowerCase() === this.selectedStatus.toLowerCase();

      const matchesJobType = this.selectedJobType === 'All' ||
        app.jobType?.toLowerCase() === this.selectedJobType.toLowerCase();

      return matchesSearch && matchesStatus && matchesJobType;
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.jobForm.reset({
      id: null,
      company: '',
      jobRole: '',
      location: '',
      applicationDate: new Date().toISOString().split('T')[0],
      jobType: 'Full-time',
      status: 'Applied',
      salary: null,
      jobUrl: '',
      notes: ''
    });
    this.isFormModalOpen = true;
  }

  openEditModal(app: JobApplication): void {
    this.isEditMode = true;
    const formattedDate = app.applicationDate ? new Date(app.applicationDate).toISOString().split('T')[0] : '';
    this.jobForm.patchValue({
      id: app.id,
      company: app.company,
      jobRole: app.jobRole,
      location: app.location,
      applicationDate: formattedDate,
      jobType: app.jobType || 'Full-time',
      status: app.status || 'Applied',
      salary: app.salary,
      jobUrl: app.jobUrl,
      notes: app.notes
    });
    this.isFormModalOpen = true;
  }

  openViewModal(app: JobApplication): void {
    this.selectedApp = app;
    this.isViewModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.selectedApp = null;
  }

  switchEditFromView(): void {
    if (this.selectedApp) {
      const appToEdit = this.selectedApp;
      this.closeViewModal();
      this.openEditModal(appToEdit);
    }
  }

  confirmDelete(app: JobApplication): void {
    this.appToDelete = app;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.appToDelete = null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jobForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  saveApplication(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const formValue = this.jobForm.value;
    const payload: JobApplication = {
      ...formValue,
      salary: formValue.salary !== null && formValue.salary !== '' ? Number(formValue.salary) : null
    };

    // Close modal instantly for zero-latency UI response
    this.closeFormModal();

    if (this.isEditMode && formValue.id) {
      // Optimistic local update
      const index = this.applications.findIndex(a => a.id === formValue.id);
      if (index !== -1) {
        this.applications[index] = { ...payload, id: formValue.id };
        this.applyLocalFilters();
      }

      this.jobService.updateJob(formValue.id, payload).subscribe({
        next: () => this.loadApplications(),
        error: (err) => console.error('Error updating application:', err)
      });
    } else {
      // Optimistic local update
      const tempItem: JobApplication = { ...payload, id: Date.now() };
      this.applications.unshift(tempItem);
      this.applyLocalFilters();

      this.jobService.createJob(payload).subscribe({
        next: () => this.loadApplications(),
        error: (err) => console.error('Error creating application:', err)
      });
    }
  }

  deleteApplication(): void {
    if (this.appToDelete && this.appToDelete.id) {
      const targetId = this.appToDelete.id;
      this.closeDeleteModal();

      // Optimistic delete
      this.applications = this.applications.filter(a => a.id !== targetId);
      this.applyLocalFilters();

      this.jobService.deleteJob(targetId).subscribe({
        next: () => this.loadApplications(),
        error: (err) => console.error('Error deleting application:', err)
      });
    }
  }

  getInitials(company: string): string {
    if (!company) return 'J';
    return company.substring(0, 2).toUpperCase();
  }
}
