import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';
import { AppConfig } from '../app.config';


interface ApiResponse {
  status: number;
  message: string;
  data: Expense[];
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = AppConfig.apiUrl; // API URL from environment
  private timeZone = 'America/New_York'; // Timezone for date conversion

  constructor(private http: HttpClient) {}

  getAllExpenses(filter:any): Observable<ApiResponse> {

    const formattedStartDate = filter.startDate
    ? `${new Date(filter.startDate).getFullYear()}-${(new Date(filter.startDate).getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${new Date(filter.startDate).getDate().toString().padStart(2, '0')}`
    : null;

  const formattedEndDate = filter.endDate
    ? `${new Date(filter.endDate).getFullYear()}-${(new Date(filter.endDate).getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${new Date(filter.endDate).getDate().toString().padStart(2, '0')}`
    : null;

  // Create a new object to send to the API
  const apiFilter = {
    ...filter,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };

  console.log('API Filter:', apiFilter); // Deb
    return this.http.post<ApiResponse>(this.apiUrl+"/getAllExpensesBasedOnFilter", apiFilter);
  }
}