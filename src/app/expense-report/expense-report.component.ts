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
  expenseAndCreditMonthYear:{ monthYear: string; totalExpense: number;totalCredit:number }[] = [];
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
      this.getUniqueMonthsAndYearsWithTotals();
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

  getUniqueMonthsAndYearsWithTotals(): void {
    const monthYearMap: { [key: string]: { totalExpense: number; totalCredit: number } } = {};
  
    this.expenses.forEach((expense) => {
      const date = new Date(expense.valueDate);
      const month = date.toLocaleString('default', { month: 'long' }); // Get month name
      const year = date.getFullYear(); // Get year
      const monthYearKey = `${month} ${year}`; // Combine month and year as a key
  
      // Initialize the month-year entry if it doesn't exist
      if (!monthYearMap[monthYearKey]) {
        monthYearMap[monthYearKey] = { totalExpense: 0, totalCredit: 0 };
      }
  
      // Add the expense and credit amounts
      monthYearMap[monthYearKey].totalExpense += expense.withdrawalAmount || 0;
      monthYearMap[monthYearKey].totalCredit += expense.depositAmount || 0;
    });
    this.expenseAndCreditMonthYear = Object.keys(monthYearMap).map((monthYear) => ({
      monthYear,
      totalExpense: monthYearMap[monthYear].totalExpense,
      totalCredit: monthYearMap[monthYear].totalCredit
    }));
    this.expenseAndCreditMonthYear.sort((a, b) => {
      
      const month = a.monthYear.split(' ')[0]; // Get month name
      const year = a.monthYear.split(' ')[1]; // Get year
      const monthIndexA = new Date(`${month} 1, ${year}`).getMonth(); // Get month index for sorting
      const yearB = b.monthYear.split(' ')[1]; // Get year for b
      const monthIndexB = new Date(`${b.monthYear.split(' ')[0]} 1, ${yearB}`).getMonth(); // Get month index for b
      if(parseInt(year) === parseInt(yearB)){
        return monthIndexA - monthIndexB;
      }
      return parseInt(year) - parseInt(yearB);
    });
    
  
    
  }
  // convertExpenseMapToArrayMonth(expenseMap:any,creditedAmountMap:any): void {

  //   // Convert expenseMap to an array of objects
  //   this.expenseArray = Object.keys(expenseMap).map((category) => ({
  //     category,
  //     total: expenseMap[category]
      
  //   })).filter((expense) => expense.total > 0);
  //   this.creditedAmountArray = Object.keys(creditedAmountMap).map((category) => ({
  //     category,
  //     total: creditedAmountMap[category]
      
  //   })).filter((expense) => expense.total > 0);
    
  // }


}