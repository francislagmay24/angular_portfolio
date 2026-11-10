import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { LoginRequest, LoginResponse, User } from './models';

const TOKEN_KEY = 'ap.token';
const USER_KEY = 'ap.user';

/**
 * Holds the JWT and the signed-in user.
 *
 * The token lives in localStorage, which is readable by any script on the
 * page — acceptable for a portfolio demo, but if you ever store anything
 * genuinely sensitive see https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
 * and consider httpOnly cookies with CSRF protection instead.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _user = signal<User | null>(this.readStoredUser());
  private readonly _token = signal<string | null>(this.readStoredToken());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap((response) => {
        this._token.set(response.token);
        this._user.set(response.user);
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  get token(): string | null {
    return this._token();
  }

  /**
   * Confirms a stored token is still accepted by the server. Returns the user,
   * or null if the token was missing/expired/revoked. Used on app startup.
   */
  refreshCurrentUser(): Observable<User | null> {
    if (!this._token()) {
      return of(null);
    }

    return this.http.get<User>('/api/auth/me').pipe(
      tap((user) => {
        this._user.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }),
      catchError(() => {
        this.logout();
        return of(null);
      }),
      map((user) => user ?? null)
    );
  }

  private readStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      // localStorage can throw in private-browsing modes.
      return null;
    }
  }

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}