import {Component, DestroyRef, effect, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {ContactFacade} from "../../contact.facade";
import {of, switchMap} from "rxjs";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {SequenceItemComponent} from "../../components/sequence-item/sequence-item.component";
import {QuestionDto, QuestionStatusEnum} from "../../state/interview/interview.model";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
export class ContactComponent implements OnInit {

  contactFacade = inject(ContactFacade);
  questions$: Signal<QuestionDto[]> = this.contactFacade.questions$;
  isLoading$: WritableSignal<boolean> = signal(false);
  private fb = inject(FormBuilder);
  questionFormControl = this.fb.control('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  });
  toggleQuestionFormState = effect(() => {
    if (this.isLoading$() || this.questions$().some(q => q.status === QuestionStatusEnum.Pending)) {
      this.questionFormControl.disable();
    } else {
      this.questionFormControl.enable();
    }
  });
  contactFormGroup = this.fb.group({
    name: this.fb.control('', Validators.required),
    surname: this.fb.control('', Validators.required),
    email: this.fb.control('', [Validators.required, Validators.email]),
    subject: this.fb.control('', Validators.required),
    message: this.fb.control('', Validators.required)
  });
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    const uniqueId = localStorage.getItem('lastSubmittedQuestionUniqueId');

    this.contactFacade.loadAnsweredQuestions().pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => {
        return uniqueId ? this.contactFacade.loadQuestionByUniqueId(uniqueId) : of(null)
      })
    ).subscribe();
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
