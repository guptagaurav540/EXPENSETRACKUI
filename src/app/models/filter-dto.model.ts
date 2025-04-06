export interface FilterDto {
    startDate:Date | string | null; // Start date for filtering
    endDate: Date | string | null;   // End date for filtering
    category: string[];
  }