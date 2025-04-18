import { Component, OnInit  } from '@angular/core';
import { Expense } from '../models/expense.model'; // Import the Expense model
import { ExpenseService } from '../service/expense.service'; // Import the Expense service
import { ExpenseDataService } from '../service/expense-data.service'; // Import the shared service

@Component({
  selector: 'app-expense-table-component',
  templateUrl: './expense-table-component.component.html',
  styleUrls: ['./expense-table-component.component.css']
})

export class ExpenseTableComponentComponent {
  
  expenses: Expense[] = []; // Array to store expenses
  loading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message
   displayedColumns: string[] = [
    'transactionId',
    'valueDate',
    'remark',
    'withdrawalAmount',
    'depositAmount',
    'category'
  ];
  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 20; // Number of rows per page
  totalPages: number = 1;
  paginatedExpenses: Expense[] = [];

  constructor(
    private expenseService: ExpenseService,
    private expenseDataService: ExpenseDataService
  ) {}


  ngOnInit(): void {
    this.expenseDataService.expenses$.subscribe((expenses) => {
      this.expenses = expenses;
      this.fetchExpenses();
      this.updatePagination();
      this.updatePaginatedExpenses();
    });
  }
  updatePaginatedExpenses(): void {
    
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedExpenses = this.expenses.slice(startIndex, endIndex);
  }
  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedExpenses();
  }

  fetchExpenses(): void {
    this.expenses = [];
    this.loading = true; // Show loading spinner
    this.expenses = this.expenseDataService.getExpenses(); // Get expenses from the shared service
    // console.log('Fetched expenses:', this.expenses); // Debugging
    this.loading = false;
    
  }

    // Get paginated expenses for the current page
  getPaginatedExpenses(): Expense[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.expenses.slice(startIndex, endIndex);
  }
  // Update pagination properties
  updatePagination(): void {
    this.totalPages = Math.ceil(this.expenses.length / this.pageSize);
    this.currentPage = 0; // Reset to the first page
  }

  onSubmit(): void {
    this.loading = true; // Show loading spinner
    this.fetchExpenses(); // Fetch expenses based on the filter
    this.updatePagination(); // Update pagination properties
    this.updatePaginatedExpenses(); // Update paginated expenses
    
  }

  

}
