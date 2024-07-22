import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QuestionDto} from "../../state/interview/interview.model";
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-sequence-item',
  standalone: true,
  imports: [
    NgIf,
    DatePipe
  ],
  templateUrl: './sequence-item.component.html',
  styleUrl: './sequence-item.component.scss'
})
export class SequenceItemComponent {

  @Input() sequence!: QuestionDto;
  @Output() cancelEvent = new EventEmitter<number>();

  onCancel(id: number) {
    this.cancelEvent.emit(id);
  }
}
