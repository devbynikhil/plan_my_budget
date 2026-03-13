/**
 * Calculate the next due date for a recurring transaction
 * @param {Date} lastDate - The last transaction date
 * @param {string} frequency - The recurring frequency (daily, weekly, monthly, yearly)
 * @returns {Date} - The next due date
 */
export const calculateNextDueDate = (lastDate, frequency) => {
  const date = new Date(lastDate);
  
  switch (frequency.toLowerCase()) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      return null; // No recurring
  }
  
  return date;
};

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} - True if the date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return today.getFullYear() === checkDate.getFullYear() &&
         today.getMonth() === checkDate.getMonth() &&
         today.getDate() === checkDate.getDate();
};

/**
 * Get all recurring frequencies
 * @returns {Array} - Array of frequency options
 */
export const getRecurringFrequencies = () => [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

/**
 * Format frequency for display
 * @param {string} frequency - The frequency value
 * @returns {string} - Formatted frequency string
 */
export const formatFrequency = (frequency) => {
  const frequencies = {
    'daily': 'Daily',
    'weekly': 'Weekly', 
    'monthly': 'Monthly',
    'yearly': 'Yearly',
    'none': 'One-time'
  };
  
  return frequencies[frequency] || 'Unknown';
};