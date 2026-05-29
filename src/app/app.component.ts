import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { distinctUntilChanged, map, shareReplay, startWith, switchMap, takeWhile, timer } from 'rxjs';
import { secondsUntil } from './countdown.utils';
import { DeadlineService } from './deadline.service';

type CountdownState =
  | { status: 'loading' }
  | { status: 'ready'; secondsLeft: number }
  | { status: 'finished' };

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
        map(() => secondsUntil(deadlineEpochMs)),
        distinctUntilChanged(),
        takeWhile((secondsLeft) => secondsLeft > 0, true),
        map(
          (secondsLeft): CountdownState =>
            secondsLeft > 0 ? { status: 'ready', secondsLeft } : { status: 'finished' }
        )
      );
    }),
    startWith<CountdownState>({ status: 'loading' }),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}
