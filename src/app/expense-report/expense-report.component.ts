import { Component, OnInit } from '@angular/core';
import { Expense } from '../models/expense.model';
import { ExpenseDataService } from '../service/expense-data.service'; // Import the shared service


@Component({
  selector: 'app-expense-report',
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.css']
})
export class ExpenseReportComponent implements OnInit {
  expenses: Expense[] = [];
  expenseArray: { category: string; totalWid: number;totalCredit: number }[] = []; // Array for HTML binding
  // creditedAmountArray:{ category: string; total: number }[] = [];
  totalExpense = 0;
  totalCredit = 0;
  constructor(
    private expenseDataService: ExpenseDataService

  ) {}

  ngOnInit(): void {
    // Subscribe to the shared expenses data
    this.expenseDataService.expenses$.subscribe((expenses) => {
      this.expenses = expenses;
      this.totalExpense=0;
      this.totalCredit=0;
      this.groupExpensesByCategory(); 
    });
  }



  groupExpensesByCategory(): void {
    
    const predefinedCategories = [
      'Grocery Delivery',
      'Food Delivery',
      'Online Shopping',
      'Salary Credited',
      'Home Expense',
      'Bank Transfer',
      'Online Payment',
      'Credit Card','Stocks',
      'Other'
    ];
    const expenseMap: { [key: string]: number } = {};
    const creditedAmountMap: { [key: string]: number } = {};
  
    // Initialize all predefined categories with a total of 0
    predefinedCategories.forEach((category) => {
      expenseMap[category] = 0;
      creditedAmountMap[category] = 0;
    });
  
    // Group expenses by category and calculate totals
    this.expenses.forEach((expense) => {
      // console.log(expense);
      const category = predefinedCategories.includes(expense.category)
        ? expense.category
        : 'Other'; // Default to 'Other' if the category is not predefined
      expenseMap[category] += expense.withdrawalAmount || 0; // Sum withdrawal amounts
      creditedAmountMap[category] += expense.depositAmount || 0; // Sum deposit amounts
      this.totalExpense+=expense.withdrawalAmount || 0;
      this.totalCredit+=expense.depositAmount || 0;
    });
    this.convertExpenseMapToArray(expenseMap,creditedAmountMap); // Convert expenseMap to an array
  }
  convertExpenseMapToArray(expenseMap:any,creditedAmountMap:any): void {

    // Convert expenseMap to an array of objects
    this.expenseArray = Object.keys(expenseMap).map((category) => ({
      category,
      totalWid: expenseMap[category],
      totalCredit: creditedAmountMap[category]
      
    }));
    
  }

}