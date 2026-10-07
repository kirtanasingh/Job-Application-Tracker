import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true
})
export class StatusBadgePipe implements PipeTransform {
  transform(status: string): string {
    switch (status?.toLowerCase()) {
      case 'applied':
        return 'badge-applied';
      case 'shortlisted':
        return 'badge-shortlisted';
      case 'interview':
      case 'interviewing':
        return 'badge-interview';
      case 'selected':
      case 'offered':
        return 'badge-selected';
      case 'rejected':
        return 'badge-rejected';
      default:
        return 'badge-default';
    }
  }
}
