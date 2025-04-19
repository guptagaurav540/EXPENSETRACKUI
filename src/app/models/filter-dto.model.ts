export interface FilterDto {
    startDate:Date | string | null; // Start date for filtering
    endDate: Date | string | null;   // End date for filtering
    remark: string | null; // Remark for filtering
    startAmount: number | null; // Amount for filtering
    endAmount: number | null; // Amount for filtering
    category: string[];
  }