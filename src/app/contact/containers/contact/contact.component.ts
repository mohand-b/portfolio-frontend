import {Component, DestroyRef, effect, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {ContactFacade} from "../../contact.facade";
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {SequenceItemComponent} from "../../components/sequence-item/sequence-item.component";
import {QuestionDto} from "../../state/interview/interview.model";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ContactDto} from "../../state/contact/contact.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  QuestionTrackingModalComponent
} from "../../components/question-tracking-modal/question-tracking-modal.component";
import {MatBadgeModule} from "@angular/material/badge";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    SequenceItemComponent,
    MatBadgeModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  lastSubmittedQuestionUniqueId: string | null = localStorage.getItem('lastSubmittedQuestionUniqueId');
  lastSubmittedQuestion: WritableSignal<QuestionDto | null> = signal(null);
  contactFacade = inject(ContactFacade);
  questions$: Signal<QuestionDto[]> = this.contactFacade.questions$;
  isLoading$: WritableSignal<boolean> = signal(false);
  private modalService = inject(NgbModal);
  private fb = inject(NonNullableFormBuilder);
  questionFormControl = this.fb.control('', {
    validators: [Validators.required, Validators.minLength(3)]
  });
  toggleQuestionFormState = effect(() => {
    if (this.isLoading$()) {
      this.questionFormControl.disable();
    } else {
      this.questionFormControl.enable();
    }
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
    this.contactFacade.loadAnsweredQuestions().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();

    if (this.lastSubmittedQuestionUniqueId) {
      this.contactFacade.getQuestionByUniqueId(this.lastSubmittedQuestionUniqueId).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (question) => this.lastSubmittedQuestion.set(question)
      });
    }
  }

  onSubmitQuestion(event: Event) {
    event.preventDefault();
    if (this.questionFormControl.invalid) {
      console.log('invalid form');
      return;
    }
    this.contactFacade.submitQuestion(this.questionFormControl.value).subscribe({
      next: (question) => {
        this.lastSubmittedQuestionUniqueId = question.uniqueId;
        this.questionFormControl.reset()
      },
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
    const modalRef = this.modalService.open(QuestionTrackingModalComponent, {
      size: 'lg',
      centered: true
    })

    modalRef.componentInstance.uniqueId = localStorage.getItem('lastSubmittedQuestionUniqueId');
    modalRef.componentInstance.lastSubmittedQuestion = this.lastSubmittedQuestion;
  }
}
