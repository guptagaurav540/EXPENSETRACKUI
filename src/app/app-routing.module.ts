import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseTableComponentComponent } from './expense-table-component/expense-table-component.component'; // Import the component
import { HeaderComponentComponent } from './header-component/header-component.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { MonthlyDetailsComponent } from './monthly-details/monthly-details.component';

const routes: Routes = [
  { path: 'home', component: ExpenseTableComponentComponent }, // Route for Expense Detail
  { path: 'report', component: ExpenseReportComponent }, // Route for Expense Report
  { path: 'monthlydetails', component: MonthlyDetailsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/home' } // Fallback route

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
