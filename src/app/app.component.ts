import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { catchError, distinctUntilChanged, map, of, shareReplay, startWith, switchMap, takeWhile, timer } from 'rxjs';
import { DeadlineService } from './deadline.service';

type CountdownState =
  | { status: 'loading' }
  | { status: 'ready'; secondsLeft: number }
  | { status: 'error' };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly deadlineService = inject(DeadlineService);

  readonly countdownState$ = this.deadlineService.getSecondsLeft().pipe(
    switchMap((initialSecondsLeft) => {
      const deadlineEpochMs = Date.now() + initialSecondsLeft * 1_000;

      return timer(0, 1_000).pipe(
        map(() => Math.max(0, Math.ceil((deadlineEpochMs - Date.now()) / 1_000))),
        distinctUntilChanged(),
        takeWhile((secondsLeft) => secondsLeft > 0, true),
        map((secondsLeft): CountdownState => ({ status: 'ready', secondsLeft }))
      );
    }),
    startWith<CountdownState>({ status: 'loading' }),
    catchError(() => of<CountdownState>({ status: 'error' })),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}
