import {Component, DestroyRef, effect, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {ContactFacade} from "../../contact.facade";
import {of, switchMap} from "rxjs";
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {SequenceItemComponent} from "../../components/sequence-item/sequence-item.component";
import {QuestionDto, QuestionStatusEnum} from "../../state/interview/interview.model";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ContactDto} from "../../state/contact/contact.model";

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
  toggleQuestionFormState = effect(() => {
    if (this.isLoading$() || this.questions$().some(q => q.status === QuestionStatusEnum.Pending)) {
      this.questionFormControl.disable();
    } else {
      this.questionFormControl.enable();
    }
  });
  private fb = inject(NonNullableFormBuilder);
  questionFormControl = this.fb.control('', {
    validators: [Validators.required, Validators.minLength(3)]
  });
  contactFormGroup = this.fb.group({
    name: this.fb.control<string>('', Validators.required),
    surname: this.fb.control<string>('', Validators.required),
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
    subject: this.fb.control<string>('', Validators.required),
    message: this.fb.control<string>('', Validators.required)
  }) as FormGroup<{ [K in keyof ContactDto]: FormControl<ContactDto[K]> }>;

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

  onSendContactMail(event: Event) {
    event.preventDefault();
    if (this.contactFormGroup.invalid) {
      return;
    }
    this.contactFacade.sendContactMail(this.contactFormGroup.value as ContactDto).subscribe({
      next: () => {
        this.contactFormGroup.reset()
      },
      error: (error) => console.error('Error sending contact mail', error)
    });
  }


  onOpenQuestionTrackingModal() {

  }
}
