import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ContactService } from '../core/contact.service';
import { ContactMessage } from '../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly auth = inject(AuthService);
  private readonly contactService = inject(ContactService);
  private readonly router = inject(Router);

  readonly messages = signal<ContactMessage[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.contactService.list().subscribe({
      next: (rows) => {
        this.messages.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load messages. Is the API and database reachable?');
        this.loading.set(false);
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString();
  }
}