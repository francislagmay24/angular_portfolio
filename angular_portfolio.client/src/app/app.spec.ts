import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AppModule } from './app-module';
import { App } from './app';
import { AuthService } from './core/auth.service';
import { PORTFOLIO } from './content/portfolio.data';

/**
 * These components are NgModule-based (standalone: false), so the testing
 * module imports AppModule rather than re-declaring them — that is what gives
 * the AOT compiler FormsModule/CommonModule in scope for their templates.
 */
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand from the content file', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    // Reads from the data layer, so this keeps passing when you edit your content.
    expect(el.querySelector('.brand')?.textContent).toContain(PORTFOLIO.hero.name);
  });

  it('should start signed out', () => {
    const auth = TestBed.inject(AuthService);
    expect(auth.isAuthenticated()).toBe(false);
  });
});