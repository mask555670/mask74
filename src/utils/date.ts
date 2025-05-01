export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const areDatesEqual = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
}; 