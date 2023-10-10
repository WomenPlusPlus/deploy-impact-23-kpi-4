# Data Validation Documentation

_Version: 1.0_  
_Last Updated: Oct 10, 2023_

This document provides detailed guidelines on how to implement data validation for the provided database schema.

## 1. Role Table

### `name`
- **Type**: VARCHAR
- **Constraints**:
  - Cannot be null. Use `if (!name) throw new Error("Name is required");`.
  - Must be unique. Check against the database before insertion.
  - Maximum length: 255 characters. Use `if (name.length > 255) throw new Error("Name is too long");`.

### `description`
- **Type**: VARCHAR
- **Constraints**:
  - Maximum length: 255 characters. Check length before insertion.

## 2. Range Table

### `min_value`
- **Type**: DECIMAL
- **Constraints**:
  - Cannot be null. Ensure value exists before insertion.

### `max_value`
- **Type**: DECIMAL

### `display_value`
- **Type**: VARCHAR
- **Constraints**:
  - Maximum length: 255 characters. Check length before insertion.

## 3. Users Table

### `username`
- **Type**: VARCHAR
- **Constraints**:
  - Cannot be null. Ensure value exists before insertion.
  - Must be unique. Check against the database before insertion.
  - Maximum length: 255 characters. Check length before insertion.

### `email`
- **Type**: VARCHAR
- **Constraints**:
  - Cannot be null. Ensure value exists before insertion.
  - Must be unique. Check against the database before insertion.
  - Valid email format. Use regex for validation.
  - Maximum length: 255 characters. Check length before insertion.

## 4. Circle Table

### `name`
- **Type**: VARCHAR
- **Constraints**:
  - Cannot be null. Ensure value exists before insertion.
  - Maximum length: 255 characters. Check length before insertion.

## 5. KPI Table

### `name`
- **Type**: VARCHAR
- **Constraints**:
  - Cannot be null. Ensure value exists before insertion.
  - Maximum length: 255 characters. Check length before insertion.

## 6. Period Table

### `year`
- **Type**: INTEGER
- **Constraints**:
  - Cannot be null. Ensure value exists before insertion.
  - Valid year format (e.g., 2023). Use simple range checks.

### `month`
- **Type**: INTEGER
- **Constraints**:
  - Between 1 and 12 inclusive. Use range checks.

### `quarter`
- **Type**: INTEGER
- **Constraints**:
  - Between 1 and 4 inclusive. Use range checks.

## 7. Audit Table

### `value`
- **Type**: DECIMAL
- **Constraints**:
  - Cannot be null. Ensure value exists before insertion.
  - Specify if there's a valid range for the value, especially if it's a percentage or a bounded metric.

### `created_timestamp` & `updated_timestamp`
- **Type**: TIMESTAMP
- **Constraints**:
  - Cannot be null. Auto-generate on insertion and update.
  - Valid timestamp format. Use date libraries for validation.

## 8. Periodicity Table

### `type`
- **Type**: VARCHAR
- **Constraints**:
  - Cannot be null. Ensure value exists before insertion.
  - Must be unique. Check against the database before insertion.
  - Maximum length: 255 characters. Check length before insertion.

### `description`
- **Type**: VARCHAR
- **Constraints**:
  - Maximum length: 255 characters. Check length before insertion.

---

**Note**: Always validate data on both frontend and backend for data integrity and security.


## Frontend Validation:

1. **Form Fields**:
   - Ensure all mandatory fields are filled using JavaScript checks.
   - Display error messages using tooltips or inline messages.
   - Use input masks for specific formats like email.

2. **Dropdowns/Select Boxes**:
   - Ensure valid options are selected using dropdown events.

3. **Date/Time Fields**:
   - Use date pickers like `Datepicker` library.
   - Ensure correct format using date libraries like `moment.js`.

4. **Number Fields**:
   - Ensure valid numbers using JavaScript checks.
   - Use input masks or spinners for number range.

5. **Email Fields**:
   - Use regex for email format validation.

6. **Submission**:
   - Disable submit button using JavaScript until validations pass.

## Backend Validation:

1. **Data Type Checks**:
   - Match data with expected data type using type checks.

2. **Boundary Checks**:
   - Ensure data is within expected range using conditional statements.

3. **Consistency Checks**:
   - Ensure data consistency across tables using JOIN operations.

4. **Existence Checks**:
   - Ensure references to other tables exist using foreign key checks.

5. **Uniqueness Checks**:
   - Ensure data uniqueness using SELECT queries before insertion.

6. **Length Checks**:
   - Ensure data doesn't exceed max length using string length checks.

7. **Null Checks**:
   - Ensure mandatory fields aren't null using null checks.

8. **Timestamps**:
   - Auto-generate timestamps using database functions.

**Note**: Always validate data on both frontend and backend for data integrity and security.
