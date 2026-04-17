import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { AuthUser } from '../../features/auth/models/auth-user.model';
import { AuthLoginRequest } from '../../features/auth/models/auth-login-request.model';
import { AuthRegisterRequest } from '../../features/auth/models/auth-register-request.model';
import { AuthLoginResponse } from '../../features/auth/models/auth-login-response.model';
import { AuthRefreshTokenRequest } from '../../features/auth/models/auth-refresh-token-request.model';
import { StorageService } from './storage.service';
import { UserRole } from '../enums/user-role.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<AuthUser | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  private isRefreshing = false;
  private readonly refreshSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    const stored = this.storage.getUser();
    if (stored) this.currentUserSignal.set(stored);
  }

  login(request: AuthLoginRequest): Observable<AuthLoginResponse> {
    return this.http
      .post<ApiResponse<AuthLoginResponse>>(`${environment.apiBaseUrl}/api/auth/login`, request)
      .pipe(
        map(res => res.data!),
        tap(data => this.handleAuthSuccess(data))
      );
  }

  register(request: AuthRegisterRequest): Observable<AuthLoginResponse> {
    return this.http
      .post<ApiResponse<AuthLoginResponse>>(`${environment.apiBaseUrl}/api/auth/register`, request)
      .pipe(
        map(res => res.data!),
        tap(data => this.handleAuthSuccess(data))
      );
  }

  updateCurrentUser(user: AuthUser): void {
    this.storage.setUser(user);
    this.currentUserSignal.set(user);
  }

  logout(): void {
    const refreshToken = this.storage.getRefreshToken();
    if (refreshToken) {
      this.http
        .post(`${environment.apiBaseUrl}/api/auth/revoke`, { refreshToken } satisfies AuthRefreshTokenRequest)
        .subscribe({ error: () => {} });
    }
    this.storage.clear();
    this.currentUserSignal.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  handleUnauthorized(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject.next(null);

      const refreshToken = this.storage.getRefreshToken();
      if (!refreshToken) {
        this.isRefreshing = false;
        this.logout();
        return throwError(() => new Error('Session expired'));
      }

      return this.http
        .post<ApiResponse<AuthLoginResponse>>(
          `${environment.apiBaseUrl}/api/auth/refresh`,
          { refreshToken } satisfies AuthRefreshTokenRequest
        )
        .pipe(
          map(res => res.data!),
          tap(data => {
            this.isRefreshing = false;
            this.handleAuthSuccess(data);
            this.refreshSubject.next(data.token.accessToken);
          }),
          switchMap(data =>
            next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${data.token.accessToken}`) }))
          ),
          catchError(err => {
            this.isRefreshing = false;
            this.logout();
            return throwError(() => err);
          })
        );
    }

    return this.refreshSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token =>
        next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }))
      )
    );
  }

  private handleAuthSuccess(data: AuthLoginResponse): void {
    this.storage.setToken(data.token.accessToken);
    this.storage.setRefreshToken(data.token.refreshToken);
    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.fullName,
      role: data.user.role as UserRole,
    };
    this.storage.setUser(user);
    this.currentUserSignal.set(user);
  }
}

