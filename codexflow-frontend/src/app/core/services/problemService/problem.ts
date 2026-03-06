import { inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../../../environments';
import { ApiResponse } from '../../models/api-response.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Problem {
  private http = inject(HttpClient);

  private base = `${Environment.problemServiceUrl}api/v1/problems`;
  

  //GET all problems
  //Controller: getAllProblems


  getAll() {
    return this.http.get<ApiResponse<Problem[]>>(this.base)
    .pipe(map(res => res.data));
  }


  //GET /problems/:id
  //Controller: getProblmedId

  getById(id:string){
    return this.http.get<ApiResponse<Problem>>('${this.base}/${id}')
    .pipe(map(res => res.data));
  }

  //GET /problems/difficulty/:difficulty
  //Controller: findByDifficulty

  getByDifficulty(difficulty: 'easy' | 'medium' | 'hard'){
    return this.http.get<ApiResponse<Problem[]>>('${this.base}/difficulty/${difficulty}')
    .pipe(map(res => res.data));
  }

}
