import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { secondsUntil } from './countdown.utils';

interface DeadlineResponse {
  secondsLeft: number;
}

@Injectable({ providedIn: 'root' })
export class DeadlineService {
  private static readonly FALLBACK_DEADLINE_ISO_UTC = '2030-01-01T00:00:00Z';

  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/deadline';

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
    const fallbackDeadlineEpochMs = Date.parse(DeadlineService.FALLBACK_DEADLINE_ISO_UTC);
    return secondsUntil(fallbackDeadlineEpochMs);
  }
}
