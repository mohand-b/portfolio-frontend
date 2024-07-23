import {Component, effect, inject, input, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {NgbActiveModal, NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {QuestionDto, QuestionStatusEnum} from "../../state/interview/interview.model";
import {DatePipe, NgClass} from "@angular/common";
import {ContactFacade} from "../../contact.facade";

@Component({
  selector: 'app-question-tracking-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgClass,
    NgbAlert
  ],
  templateUrl: './question-tracking-modal.component.html',
  styleUrl: './question-tracking-modal.component.scss'
})
export class QuestionTrackingModalComponent implements OnInit {

  @Input() uniqueId?: string;
  lastSubmittedQuestion = input<QuestionDto | null>(null);
  question: WritableSignal<QuestionDto | null> = signal(null);
  public modal = inject(NgbActiveModal);
  isIncorrectUniqueId: WritableSignal<boolean> = signal(false);
  private fb = inject(NonNullableFormBuilder);
  questionTrackingFormControl = this.fb.control(
    this.uniqueId ?? '',
    {
      validators: [Validators.required, Validators.minLength(3)]
    });
  private contactFacade = inject(ContactFacade);

  constructor() {
    effect(() => {
      if (this.lastSubmittedQuestion()) {
        this.question.set(this.lastSubmittedQuestion())
      }
    }, {
      allowSignalWrites: true
    });
  }

  ngOnInit(): void {
    this.questionTrackingFormControl.setValue(this.uniqueId!);
  }

  onTrackQuestion() {
    this.contactFacade.getQuestionByUniqueId(this.questionTrackingFormControl.value).subscribe({
      next: question => {
        this.isIncorrectUniqueId.set(false);
        this.question.set(question);
      },
      error: () => {
        this.isIncorrectUniqueId.set(true);
      }
    });
  }

  getStatusClass(status: QuestionStatusEnum): string {
    switch (status) {
      case QuestionStatusEnum.Pending:
        return 'text-orange-500';
      case QuestionStatusEnum.Approved:
        return 'text-green-500';
      case QuestionStatusEnum.Rejected:
        return 'text-red-500';
      default:
        return '';
    }
  }
}
