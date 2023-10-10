# Database Schema Explanation

This document provides an overview of the database schema used to store form data related to various KPIs, circles, users, and other related entities.

## Tables Overview:

1. **Role**: Represents the different roles users can have.
2. **Range**: Represents the range of values for KPIs.
3. **Users**: Contains information about the users.
4. **Circle**: Represents different circles or groups.
5. **User_Circle**: Represents the relationship between users and circles.
6. **KPI**: Contains information about Key Performance Indicators.
7. **Circle_KPI**: Represents the relationship between circles and KPIs.
8. **Period**: Represents the time period for which data is recorded.
9. **Audit**: Contains the actual KPI values for specific periods.
10. **Frequency**: Represents the frequency with which KPIs are recorded (e.g., monthly, quarterly).

## Detailed Table Descriptions:

### 1. Role

- **id**: Unique identifier for the role.
- **name**: Name of the role (e.g., "default").
- **description**: Description of the role.

### 2. Range

- **id**: Unique identifier for the range.
- **min_value**: Minimum value of the range.
- **max_value**: Maximum value of the range (can be null for open-ended ranges).
- **display_value**: A string representation of the range (e.g., "0 <= % <= 100").

### 3. Users

- **id**: Unique identifier for the user.
- **username**: Username of the user.
- **email**: Email address of the user.
- **role_id**: Foreign key referencing the Role table.

### 4. Circle

- **id**: Unique identifier for the circle.
- **name**: Name of the circle (e.g., "HR").

### 5. User_Circle

- **id**: Unique identifier for the user-circle relationship.
- **user_id**: Foreign key referencing the Users table.
- **circle_id**: Foreign key referencing the Circle table.

### 6. KPI

- **id**: Unique identifier for the KPI.
- **name**: Name of the KPI (e.g., "share of teams constituted as circles").
- **sample_value**: Sample value for the KPI.
- **description**: Description of the KPI.
- **range_id**: Foreign key referencing the Range table.
- **frequency_id**: Foreign key referencing the Frequency table.

### 7. Circle_KPI

- **id**: Unique identifier for the circle-KPI relationship.
- **circle_id**: Foreign key referencing the Circle table.
- **kpi_id**: Foreign key referencing the KPI table.

### 8. Period

- **id**: Unique identifier for the period.
- **year**: Year of the period.
- **month**: Month of the period (can be null for non-monthly periods).
- **quarter**: Quarter of the year (can be null for non-quarterly periods).

### 9. Audit

- **id**: Unique identifier for the audit entry.
- **circle_kpi_id**: Foreign key referencing the Circle_KPI table.
- **user_id**: Foreign key referencing the Users table.
- **period_id**: Foreign key referencing the Period table.
- **value**: Actual value of the KPI for the specified period.
- **created_timestamp**: Timestamp when the entry was created.
- **updated_timestamp**: Timestamp when the entry was last updated.

### 10. Frequency

- **id**: Unique identifier for the frequency.
- **type**: Type of frequency (e.g., "month", "quarter").
- **description**: Description of the frequency.

---

## Sample Data:

The form data provided contains entries for various circles, KPIs, periodicities, ranges, periods, values, users, and roles. For example:

```plaintext
circle: HR
kpi: share of teams constituted as circles
periodicity: month
range: 0 <= % <= 100
period_year: 2023
period_month: 1
value: 35
user: default@test.com
role: default
```

This represents a KPI entry for the HR circle, indicating that in January 2023, 35% of teams were constituted as circles.