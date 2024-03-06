import {Component, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ContactFacade} from "../../contact.facade";
import {of, Subscription, switchMap} from "rxjs";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {SequenceItemComponent} from "../../components/sequence-item/sequence-item.component";
import {QuestionStatusEnum} from "../../state/interview/interview.model";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    SequenceItemComponent
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
  questions$ = this.contactFacade.questions$;
  isLoading$ = signal(false);
  toggleQuestionFormState = effect(() => {
    if (this.isLoading$() || this.questions$().some(q => q.status === QuestionStatusEnum.Pending)) {
      this.questionFormControl.disable();
    } else {
      this.questionFormControl.enable();
    }
  });

  private subscription = new Subscription();

  ngOnInit() {
    const uniqueId = localStorage.getItem('lastSubmittedQuestionUniqueId');

    this.subscription.add(this.contactFacade.loadAnsweredQuestions().pipe(
      switchMap(() => {
        return uniqueId ? this.contactFacade.loadQuestionByUniqueId(uniqueId) : of(null)
      })
    ).subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmitQuestion(event: Event) {
    event.preventDefault();
    if (this.questionFormControl.invalid) {
      console.log('invalid form');
      return;
    }
    this.contactFacade.submitQuestion(this.questionFormControl.value).subscribe({
      next: () => this.questionFormControl.reset(),
      error: (error) => console.error('Erreur lors de la soumission', error)
    });
  }

  onCancelQuestion(id: number) {
    this.contactFacade.cancelQuestion(id).subscribe();
  }


}
