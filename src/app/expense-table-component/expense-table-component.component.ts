import { Component, OnInit  } from '@angular/core';
import { Expense } from '../models/expense.model'; // Import the Expense model
import { ExpenseService } from '../service/expense.service'; // Import the Expense service
import { FilterDto } from '../models/filter-dto.model'; // Import the FilterDto model
import { ExpenseDataService } from '../service/expense-data.service'; // Import the shared service
import { filter } from 'rxjs';

@Component({
  selector: 'app-expense-table-component',
  templateUrl: './expense-table-component.component.html',
  styleUrls: ['./expense-table-component.component.css']
})

export class ExpenseTableComponentComponent {
  
  expenses: Expense[] = []; // Array to store expenses
  loading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message
  filterDto: FilterDto = {
    startDate: null, // Initialize startDate as null
    endDate: null,   // Initialize endDate as null
    category: []     // Initialize category as an empty array
  };
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
    this.fetchExpenses();
    this.updatePagination();
    this.updatePaginatedExpenses();
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

    this.expenseService.getAllExpenses(this.filterDto).subscribe(
      (response) => {
        if (response.status === 200) {
          this.expenses = response.data.sort((a: Expense, b: Expense) => {
            const yearA = new Date(a.valueDate).getFullYear();
            const yearB = new Date(b.valueDate).getFullYear();
            if(yearA !== yearB) {
              return yearA - yearB; // Ascending order (earliest to latest)
            }
            const monthA = new Date(a.valueDate).getMonth();
            const monthB = new Date(b.valueDate).getMonth();
            return monthA - monthB; // Ascending order (earliest to latest)
          });          
          this.expenses = response.data;
           // Assign data to expenses array
          this.expenseDataService.setExpenses(response.data); // Update the shared service
          console.log('Expenses loaded:', this.expenses); // Debugging
          // this.expenses = this.expenses.filter(expense => expense.withdrawalAmount >= 4898 && expense.withdrawalAmount <= 5000);

        } else {
          this.errorMessage = response.message; // Handle non-200 status
          console.error('Error Message:', this.errorMessage); // Debugging
        }
       
        this.loading = false;
        this.updatePagination(); // Update pagination properties
        this.updatePaginatedExpenses(); // Update paginated expenses
        
      },
      (error) => {
        this.errorMessage = 'Failed to fetch expenses. Please try again later.';
        console.error('API Error:', error); // Debugging
        this.loading = false;
      }
    );
    
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



  // Method to handle category checkbox changes
  onCategoryChange(category: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.filterDto.category.push(category); // Add category to the array
    } else {
      this.filterDto.category = this.filterDto.category.filter(cat => cat !== category); // Remove category from the array
    }
  }

  onSubmit(): void {
    this.loading = true; // Show loading spinner
    this.fetchExpenses(); // Fetch expenses based on the filter
    this.updatePagination(); // Update pagination properties
    this.updatePaginatedExpenses(); // Update paginated expenses
    
  }

  

}
