import {Component, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ContactFacade} from "../../contact.facade";
import {of, Subscription, switchMap} from "rxjs";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {QuestionStatusEnum} from "../../state/interview/interview.model";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, OnDestroy {

  contactFacade = inject(ContactFacade);
  questionFormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  });
  questionAlreadySubmitted = localStorage.getItem('lastSubmittedQuestionUniqueId') !== null;
  questions$ = this.contactFacade.questions$;
  isLoading$ = signal(false);
  onLoading = effect(() => {
    if (this.isLoading$() || this.questions$().some(q => q.status === QuestionStatusEnum.Pending)) {
      this.questionFormControl.disable();
    } else {
      this.questionFormControl.enable();
    }
  })
  private subscription = new Subscription();

  ngOnInit() {
    const uniqueId = localStorage.getItem('lastSubmittedQuestionUniqueId');

    this.subscription.add(this.contactFacade.getAnsweredQuestions().pipe(
      switchMap(() => {
        return uniqueId ? this.contactFacade.getQuestionByUniqueId(uniqueId) : of(null)
      })
    ).subscribe({
      next: res => {
        if (res) {
          this.questionFormControl.disable();
        }
      },
      error: err => console.error(err)
    }));

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmitQuestion() {
    if (this.questionFormControl.invalid) {
      return;
    }
    this.subscription.add(this.contactFacade.submitQuestion(this.questionFormControl.value).subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    }));
  }


}
