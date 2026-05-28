import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

interface DeadlineResponse {
  secondsLeft: number;
}

@Injectable({ providedIn: 'root' })
export class DeadlineService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/deadline';
  private readonly fallbackDeadlineIsoUtc = '2030-01-01T00:00:00Z';

  getSecondsLeft(): Observable<number> {
    return this.http
      .get<DeadlineResponse>(this.endpoint)
      .pipe(
        map((response) => this.toValidSeconds(response?.secondsLeft)),
        catchError(() => of(this.getFallbackSecondsLeft()))
      );
  }

  private toValidSeconds(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      return Math.floor(value);
    }

    return this.getFallbackSecondsLeft();
  }

  private getFallbackSecondsLeft(): number {
    const fallbackDeadlineEpochMs = Date.parse(this.fallbackDeadlineIsoUtc);
    return Math.max(0, Math.ceil((fallbackDeadlineEpochMs - Date.now()) / 1_000));
  }
}
