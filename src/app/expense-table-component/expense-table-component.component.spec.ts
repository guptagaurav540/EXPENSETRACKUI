import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTableComponentComponent } from './expense-table-component.component';

describe('ExpenseTableComponentComponent', () => {
  let component: ExpenseTableComponentComponent;
  let fixture: ComponentFixture<ExpenseTableComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseTableComponentComponent]
    });
    fixture = TestBed.createComponent(ExpenseTableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
