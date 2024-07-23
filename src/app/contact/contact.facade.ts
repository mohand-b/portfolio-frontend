import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {inject, Injectable, Signal} from "@angular/core";
import {InterviewService} from "./state/interview/interview.service";
import {QuestionDto, QuestionStatusEnum} from "./state/interview/interview.model";
import {selectAllEntities, setEntities, withEntities} from "@ngneat/elf-entities";
import {map, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {ContactService} from "./state/contact/contact.service";
import {ContactDto} from "./state/contact/contact.model";

const interviewStore = createStore({
    name: 'interview',
  },
  withEntities<QuestionDto>(),
  withProps<{ lastSubmittedQuestionUniqueId: string | null }>({
    lastSubmittedQuestionUniqueId: localStorage.getItem('lastSubmittedQuestionUniqueId')
  }),
)

@Injectable({providedIn: 'root'})
export class ContactFacade {


  lastSubmittedQuestionUniqueId = toSignal(
    interviewStore.pipe(select(state => state.lastSubmittedQuestionUniqueId))
    , {
      initialValue: localStorage.getItem('lastSubmittedQuestionUniqueId')
    });
  questions$: Signal<QuestionDto[]> = toSignal(interviewStore.pipe(
    selectAllEntities(),
    map((questions: QuestionDto[]) => questions.sort((a, b) => {
      if (a.status === QuestionStatusEnum.Pending && b.status !== QuestionStatusEnum.Pending) {
        return -1;
      } else if (a.status !== QuestionStatusEnum.Pending && b.status === QuestionStatusEnum.Pending) {
        return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }))), {
    initialValue: []
  });

  private interviewService = inject(InterviewService);
  private contactService = inject(ContactService);

  sendContactMail(contactDto: ContactDto) {
    return this.contactService.sendContactMail(contactDto);
  }

  submitQuestion(question: string) {
    return this.interviewService.submitQuestion(question).pipe(
      tap({
        next: (question) => {
          interviewStore.update(setProps({lastSubmittedQuestionUniqueId: question.uniqueId}));
          localStorage.setItem('lastSubmittedQuestionUniqueId', question.uniqueId);
        },
        error: (error) => {
          console.error('Error submitting question', error);
        }
      })
    );
  }

  getQuestionByUniqueId(questionUniqueId: string) {
    return this.interviewService.getQuestionByUniqueId(questionUniqueId);
  }

  loadAnsweredQuestions() {
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

  cancelQuestion(questionId: number) {
    return this.interviewService.deleteQuestion(questionId).pipe(
      tap({
        next: () => {
          interviewStore.update(setProps({lastSubmittedQuestionUniqueId: null}));
          localStorage.removeItem('lastSubmittedQuestionUniqueId');
        },
        error: (error) => {
          console.error('Error deleting question', error);
        }
      })
    );
  }
}
