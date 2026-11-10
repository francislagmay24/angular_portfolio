import { Component, inject } from '@angular/core';
import { ContactService } from '../core/contact.service';
import { ContactRequest } from '../core/models';
import { NAV_SECTIONS, PORTFOLIO, PortfolioContent } from '../content/portfolio.data';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly content: PortfolioContent = PORTFOLIO;
  readonly nav = NAV_SECTIONS;

  private readonly contactService = inject(ContactService);

  form = {
    name: '',
    email: '',
    company: '',
    message: '',
    website: '', // honeypot — must stay empty
  };

  sending = false;
  sent = false;
  error: string | null = null;
  readonly year = new Date().getFullYear();

  submit(): void {
    if (this.sending) {
      return;
    }

    this.sending = true;
    this.error = null;

    const payload: ContactRequest = {
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      company: this.form.company.trim() || undefined,
      message: this.form.message.trim(),
      website: this.form.website,
    };

    this.contactService.send(payload).subscribe({
      next: () => {
        this.sending = false;
        this.sent = true;
        this.form = { name: '', email: '', company: '', message: '', website: '' };
      },
      error: () => {
        this.sending = false;
        this.error =
          'Sorry — your message could not be sent. Please email me directly instead.';
      },
    });
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}