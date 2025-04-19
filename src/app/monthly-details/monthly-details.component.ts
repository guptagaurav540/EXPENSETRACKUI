import { Component } from '@angular/core';
import { Expense } from '../models/expense.model';
import { ExpenseDataService } from '../service/expense-data.service'; // Import the shared service


@Component({
  selector: 'app-monthly-details',
  templateUrl: './monthly-details.component.html',
  styleUrls: ['./monthly-details.component.css'],
})
export class MonthlyDetailsComponent {
  expenses: Expense[] = [];
  expenseAndCreditMonthYear: { monthYear: string; totalExpense: number; totalCredit: number }[] = [];
  totalExpense = 0;
  totalCredit = 0;
  chartOptions: any; // Declare chartOptions as a property of the class

  constructor(
    private expenseDataService: ExpenseDataService

  ) { }
  ngOnInit(): void {
    // Subscribe to the shared expenses data
    this.expenseDataService.expenses$.subscribe((expenses) => {
      this.expenses = expenses;
      this.totalExpense = 0;
      this.totalCredit = 0;
      this.getUniqueMonthsAndYearsWithTotals();
    });
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
      if (parseInt(year) === parseInt(yearB)) {
        return monthIndexA - monthIndexB;
      }
      return parseInt(year) - parseInt(yearB);
    });

    this.expenses.forEach((expense) => {
      // console.log(expense);
      this.totalExpense += expense.withdrawalAmount || 0;
      this.totalCredit += expense.depositAmount || 0;
    });
    this.chartOptions = {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Expense Graph"
      },
      axisX: {
        valueFormatString: "DD MMM",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: "Expense ",
        crosshair: {
          enabled: true
        }
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "right",
        dockInsidePlotArea: true,
        itemclick: function (e: any) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      },
      data: [
        {
          type: "line",
          showInLegend: true,
          name: "Total Expense",
          dataPoints: this.expenseAndCreditMonthYear.map((entry) => ({
            label: entry.monthYear,
            y: entry.totalExpense
          }))
        },
        {
          type: "line",
          showInLegend: true,
          name: "Total Credit",
          dataPoints: this.expenseAndCreditMonthYear.map((entry) => ({
            label: entry.monthYear,
            y: entry.totalCredit
          }))
        }
      ]
    };
  }
}
