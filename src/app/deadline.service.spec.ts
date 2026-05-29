import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DeadlineService } from './deadline.service';

describe('DeadlineService', () => {
  let service: DeadlineService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DeadlineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return API secondsLeft when response is valid', () => {
    service.getSecondsLeft().subscribe((secondsLeft) => {
      expect(secondsLeft).toBe(120);
    });

    httpMock.expectOne('/api/deadline').flush({ secondsLeft: 120 });
  });

  it('should use fallback when API response is invalid', () => {
    const expected = Math.max(
      0,
      Math.ceil((Date.parse('2030-01-01T00:00:00Z') - Date.now()) / 1_000)
    );

    service.getSecondsLeft().subscribe((secondsLeft) => {
      expect(secondsLeft).toBe(expected);
    });

    httpMock.expectOne('/api/deadline').flush({ secondsLeft: -1 });
  });

  it('should use fallback when API request fails', () => {
    const expected = Math.max(
      0,
      Math.ceil((Date.parse('2030-01-01T00:00:00Z') - Date.now()) / 1_000)
    );

    service.getSecondsLeft().subscribe((secondsLeft) => {
      expect(secondsLeft).toBe(expected);
    });

    httpMock.expectOne('/api/deadline').flush(null, { status: 404, statusText: 'Not Found' });
  });
});
