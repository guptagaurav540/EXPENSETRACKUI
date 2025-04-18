import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDataService {
  private expensesSource = new BehaviorSubject<Expense[]>([]); // BehaviorSubject to hold expenses
  expenses$ = this.expensesSource.asObservable(); // Observable for components to subscribe to

  setExpenses(expenses: Expense[]): void {
    this.expensesSource.next(expenses); // Update the expenses
  }
  getExpenses(): Expense[] {
    return this.expensesSource.getValue(); // Get the current value of expenses
  }
}