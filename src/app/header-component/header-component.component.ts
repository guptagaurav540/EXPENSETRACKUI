import { Component } from '@angular/core';
import { FilterDto } from '../models/filter-dto.model'; // Import the FilterDto model
import { ExpenseDataService } from '../service/expense-data.service';
import { ExpenseService } from '../service/expense.service';
import { Expense } from '../models/expense.model'; // Import the Expense model
@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent {
  constructor(
    private expenseService: ExpenseService,
    private expenseDataService: ExpenseDataService,
  ) { }

  filterDto: FilterDto = {
    startDate: null, // Initialize startDate as null
    endDate: null,   // Initialize endDate as null
    category: [],     // Initialize category as an empty array
    remark: null,    // Initialize remark as null
    startAmount: null, // Initialize startAmount as null
    endAmount: null   // Initialize endAmount as null
  };
  expenses: Expense[] = []; // Array to store expenses
  loading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message
  onSubmit(): void {
    console.log('Form submitted:', this.filterDto);
    // Add your form submission logic here
    this.fetchExpenses();
  }
  resetFilter(): void {
    this.filterDto = {
      startDate: null,
      endDate: null,
      category: [],
      remark: '',
      startAmount: null,
      endAmount: null
    };
    this.fetchExpenses(); // Fetch all expenses when the filter is reset
  }

  ngOnInit(): void {
    this.fetchExpenses(); // Fetch expenses when the component initializes
  }
  fetchExpenses(): void {
     
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
          
        },
        (error) => {
          this.errorMessage = 'Failed to fetch expenses. Please try again later.';
          console.error('API Error:', error); // Debugging
          this.loading = false;
        }
      );
      
    }

}
