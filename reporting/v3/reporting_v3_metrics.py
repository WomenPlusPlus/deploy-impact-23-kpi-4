#%%
import pandas as pd

# Load data from CSV files
circles = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Circle.csv')
kpis = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/KPI.csv')
circle_kpis = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Circle_KPI.csv')
audits = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Audit.csv')
periods = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Period.csv')

# Merge the dataframes to get a single dataframe with all relevant data
merged = audits.merge(circle_kpis, left_on='circle_kpi_id', right_on='id', suffixes=('', '_ck')).merge(
    circles, left_on='circle_id', right_on='id', suffixes=('', '_circle')).merge(
    kpis, left_on='kpi_id', right_on='id', suffixes=('', '_kpi')).merge(
    periods, left_on='period_id', right_on='id', suffixes=('', '_period'))

print(merged.columns)
print(merged.head())

#%%
# Calculate the metrics
grouped = merged.groupby(['name', 'name_kpi'])

def start_end_period(group):
    start_month, end_month = group['month'].min(), group['month'].max()
    start_quarter, end_quarter = group['quarter'].min(), group['quarter'].max()
    
    start_year, end_year = group['year'].min(), group['year'].max()
    
    start_year = f"/{start_year}"
    end_year = f"/{end_year}" 
    
    if pd.isnull(start_quarter):  # If quarters data is NaN, use months
        return f"{int(start_month)}{start_year} - {int(end_month)}{end_year}"
    return f"Q{int(start_quarter)}{start_year} - Q{int(end_quarter)}{end_year}"

period_range = grouped.apply(start_end_period)

metrics = pd.DataFrame({
    'total_audits': grouped['value'].count(),
    'avg_value': grouped['value'].mean().round(2),
    'min_value': grouped['value'].min(),
    'max_value': grouped['value'].max(),
    'latest_value': grouped.apply(lambda g: g.sort_values(by='created_timestamp', ascending=False).iloc[0]['value']),
    'period_range': period_range
}).reset_index()

pd.set_option('display.float_format', '{:.2f}'.format)
print(metrics)

# Import required libraries
from fpdf import FPDF

# Create a class that extends FPDF to be able to handle the table and headers
class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, 'Monthly KPI Report', 0, 1, 'C')
        self.ln(20)  # Add a gap of 20 units

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, 'Page ' + str(self.page_no()), 0, 0, 'C')

    def table(self, df):
        self.set_font('Arial', '', 9)
        # Calculate the widths based on content as before
        raw_col_widths = [
            max(self.get_string_width(str(max(df[col], key=lambda x: len(str(x))))), 
                self.get_string_width(col)) 
            for col in df.columns
        ]

        # Define the maximum width the table should occupy (e.g., 90% of page width)
        max_table_width = 0.9 * pdf.w

        # Calculate the scaling factor
        scaling_factor = max_table_width / sum(raw_col_widths)

        # Scale the columns proportionally
        col_widths = [width * scaling_factor for width in raw_col_widths]
        th = 10
        # Set the font to bold for headers
        self.set_font('Arial', 'B', 9)
        
        # Draw table headers
        for i, header in enumerate(df.columns):
            self.cell(col_widths[i], th, header, 1)
        self.ln(th)
        
        # Reset font to normal for the table rows
        self.set_font('Arial', '', 9)
        
        # Draw table rows
        for row in df.values:
            for i, item in enumerate(row):
                self.cell(col_widths[i], th, str(item), 1)
            self.ln(th)

# Create PDF instance
pdf = PDF('L')
pdf.add_page()
pdf.table(metrics)
pdf.output('KPI_report.pdf')
