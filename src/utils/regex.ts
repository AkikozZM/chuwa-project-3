/**
 * Email must be the format of:
 * abcd@xxx.com
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password must be:
 * 1. At least 8 chars
 * 2. At least one lowercase letter
 * 3. At least one uppercase letter
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

/** UPC (Universal Product Code): exactly 12 digits. */
export const UPC_REGEX = /^\d{12}$/;
