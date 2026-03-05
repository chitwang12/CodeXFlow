import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsList } from './problems-list';

describe('ProblemsList', () => {
  let component: ProblemsList;
  let fixture: ComponentFixture<ProblemsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemsList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProblemsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
