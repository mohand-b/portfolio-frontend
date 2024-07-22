import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceItemComponent } from './sequence-item.component';

describe('SequenceItemComponent', () => {
  let component: SequenceItemComponent;
  let fixture: ComponentFixture<SequenceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequenceItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SequenceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
