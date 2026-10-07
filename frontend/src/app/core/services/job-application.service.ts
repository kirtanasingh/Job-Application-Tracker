import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { JobApplication } from '../models/job-application.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private apiUrl = 'http://localhost:5000/api/jobs';
  private statusUrl = 'http://localhost:5000/api/applications/status';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (userId) {
      headers = headers.set('X-User-Id', userId.toString());
    }
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getJobs(search?: string, status?: string, jobType?: string): Observable<JobApplication[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (status && status !== 'All') params = params.set('status', status);
    if (jobType && jobType !== 'All') params = params.set('jobType', jobType);

    return this.http.get<JobApplication[]>(this.apiUrl, { headers: this.getHeaders(), params }).pipe(
      catchError(error => {
        console.error('Error fetching jobs:', error);
        return of([]);
      })
    );
  }

  getJob(id: number): Observable<JobApplication | null> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error(`Error fetching job ${id}:`, error);
        return of(null);
      })
    );
  }

  createJob(job: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, job, { headers: this.getHeaders() });
  }

  updateJob(id: number, job: JobApplication): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.apiUrl}/${id}`, job, { headers: this.getHeaders() });
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getApiStatus(): Observable<{ status: string; service: string; timestamp: string }> {
    return this.http.get<{ status: string; service: string; timestamp: string }>(this.statusUrl).pipe(
      catchError(() => of({ status: 'Disconnected', service: 'JobTrack API', timestamp: new Date().toISOString() }))
    );
  }
}
