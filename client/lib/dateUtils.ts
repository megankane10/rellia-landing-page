/**
 * Returns the last day of the current month formatted as "Month DD" (e.g., "May 31").
 */
export function getCurrentMonthDeadline(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  
  // Last day of current month:
  // Date(year, month + 1, 0) gives the last day of 'month'
  const lastDay = new Date(year, month + 1, 0)
  
  const monthName = lastDay.toLocaleString("default", { month: "long" })
  const day = lastDay.getDate()
  
  return `${monthName} ${day}`
}
