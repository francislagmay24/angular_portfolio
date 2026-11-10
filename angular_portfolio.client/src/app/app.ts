import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth.service';
import { NAV_SECTIONS, PORTFOLIO } from './content/portfolio.data';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly brand = PORTFOLIO.hero.name;
  readonly nav = NAV_SECTIONS;

  ngOnInit(): void {
    // Re-validate a stored token once at startup, so a stale token in
    // localStorage does not leave the header claiming you are signed in.
    this.auth.refreshCurrentUser().subscribe();
  }

  /**
   * Nav links target sections of the portfolio page. If the visitor is
   * currently on /login or /dashboard we go home first, then scroll.
   */
  async goToSection(id: string): Promise<void> {
    if (this.router.url !== '/') {
      await this.router.navigateByUrl('/');
      // Let the home view render before measuring the scroll target.
      await new Promise((resolve) => setTimeout(resolve));
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}