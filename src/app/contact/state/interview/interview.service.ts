import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {QuestionDto} from "./interview.model";
import {Observable} from "rxjs";


@Injectable({providedIn: 'root'})
export class InterviewService {

  private http = inject(HttpClient);
  private readonly questionsBaseUrl = `${environment.apiUrl}/questions`;

  submitQuestion(question: string): Observable<QuestionDto> {
    return this.http.post<QuestionDto>(`${this.questionsBaseUrl}/submit`, {question_text: question});
  }

  getQuestionByUniqueId(questionUniqueId: string): Observable<QuestionDto> {
    return this.http.get<QuestionDto>(`${this.questionsBaseUrl}/${questionUniqueId}`);
  }

  getAnsweredQuestions(): Observable<QuestionDto[]> {
    return this.http.get<QuestionDto[]>(`${this.questionsBaseUrl}/answered/`);
  }

  deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.questionsBaseUrl}/delete/${questionId}`);
  }

}
