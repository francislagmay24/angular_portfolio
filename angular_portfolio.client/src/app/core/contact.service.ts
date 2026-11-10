import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessage, ContactRequest } from './models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  send(payload: ContactRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/contact', payload);
  }

  list(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>('/api/contact');
  }
}