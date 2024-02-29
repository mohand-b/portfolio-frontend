import {createStore} from "@ngneat/elf";
import {inject, Injectable, Signal} from "@angular/core";
import {InterviewService} from "./state/interview/interview.service";
import {QuestionDto, QuestionStatusEnum} from "./state/interview/interview.model";
import {addEntities, selectAllEntities, setEntities, withEntities} from "@ngneat/elf-entities";
import {map, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

const interviewStore = createStore({
    name: 'interview',
  },
  withEntities<QuestionDto>(),
)


@Injectable({providedIn: 'root'})
export class ContactFacade {


  questions$: Signal<QuestionDto[]> = toSignal(interviewStore.pipe(
    selectAllEntities(),
    map(questions => questions.sort((a, b) => {
      if (a.status === QuestionStatusEnum.Pending && b.status !== QuestionStatusEnum.Pending) {
        return 1;
      } else if (a.status !== QuestionStatusEnum.Pending && b.status === QuestionStatusEnum.Pending) {
        return -1;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }))), {
    initialValue: []
  });
  private interviewService = inject(InterviewService);

  submitQuestion(question: string) {
    return this.interviewService.submitQuestion(question).pipe(
      tap({
        next: (question) => {
          interviewStore.update(addEntities(question));
          localStorage.setItem('lastSubmittedQuestionUniqueId', question.uniqueId);
        },
        error: (error) => {
          console.error('Error submitting question', error);
        }
      })
    );
  }

  getQuestionByUniqueId(questionUniqueId: string) {
    return this.interviewService.getQuestionByUniqueId(questionUniqueId).pipe(
      tap({
        next: (question) => {
          interviewStore.update(addEntities(question));
        },
        error: (error) => {
          console.error('Error getting question', error);
        }
      })
    );
  }

  getAnsweredQuestions() {
    return this.interviewService.getAnsweredQuestions().pipe(
      tap({
        next: (questions) => {
          const storedUniqueId = localStorage.getItem('lastSubmittedQuestionUniqueId');
          if (storedUniqueId) {
            const questionExists = questions.some(question => question.uniqueId === storedUniqueId);
            if (questionExists) {
              localStorage.removeItem('lastSubmittedQuestionUniqueId');
            }
          }
          interviewStore.update(setEntities(questions));
        },
        error: (error) => {
          console.error('Error getting answered questions', error);
        }
      })
    );
  }
}
