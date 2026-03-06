import { inject, Injectable } from '@angular/core';
import { Environment } from '../../../../environments';
import { HttpClient } from '@angular/common/http';
import { CreateSubmissionDTO, Submission, SubmissionStatus } from '../../models/submission.model';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../models/api-response.model';
import { interval, switchMap, takeWhile, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {

  private http = inject(HttpClient);

  private base = `${Environment.submissionServiceUrl}/api/v1/submissions`;

  // POST /submissions/create
  create(dto: CreateSubmissionDTO) {
    return this.http
      .post<ApiResponse<Submission>>(`${this.base}/create`, dto)
      .pipe(map(res => res.data));
  }

  // GET /submissions/:id
  getById(id: string) {
    return this.http
      .get<ApiResponse<Submission>>(`${this.base}/${id}`)
      .pipe(map(res => res.data));
  }

  // GET /submissions/:id/data
  getDataById(id: string) {
    return this.http
      .get<ApiResponse<any>>(`${this.base}/${id}/data`)
      .pipe(map(res => res.data));
  }

  // GET /submissions/problem/:problemId
  getByProblemId(id: string) {
    return this.http
      .get<ApiResponse<Submission[]>>(`${this.base}/problem/${id}`)
      .pipe(map(res => res.data));
  }

  // Poll every 2 seconds until done
  pollUntilDone(id: string) {
    return interval(2000).pipe(
      switchMap(() => this.getById(id)),
      takeWhile(
        sub =>
          sub.status !== SubmissionStatus.SUCCESS &&
          sub.status !== SubmissionStatus.WRONG_ANSWER &&
          sub.status !== SubmissionStatus.FAILED,
        true
      ),
      share()
    );
  }
}