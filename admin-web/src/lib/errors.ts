import axios from 'axios'

/**
 * Turns an API failure into a sentence we can show to the user. The API's
 * ErrorResponse shape is `{ code, message, fieldErrors }`.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message) {
      return data.message
    }
    if (!error.response) {
      return 'We could not reach the API. Check that the server is running and try again.'
    }
  }
  return fallback
}
