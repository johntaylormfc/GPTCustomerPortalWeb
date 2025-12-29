import { cookies } from 'next/headers';

/** Returns the current customer number from cookie, or empty string if not set. */
export function getCurrentCustomerNo(): string {
  const cookieValue = cookies().get('customerNo')?.value?.trim();
  return cookieValue || '';
}
