import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionTrackingModalComponent } from './question-tracking-modal.component';

describe('QuestionTrackingModalComponent', () => {
  let component: QuestionTrackingModalComponent;
  let fixture: ComponentFixture<QuestionTrackingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionTrackingModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionTrackingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
