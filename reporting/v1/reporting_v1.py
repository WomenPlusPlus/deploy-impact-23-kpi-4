#%%
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.backends.backend_pdf import PdfPages

# Load CSV files into pandas DataFrames
audit_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Audit.csv')
circle_kpi_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Circle_KPI.csv')
role_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Circle.csv')
users_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Users.csv')
circle_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Circle.csv')
frequency_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Frequency.csv')
kpi_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/KPI.csv')

# Merge DataFrames to get required data for each circle
merged_df = audit_df.merge(circle_kpi_df, left_on='circle_kpi_id', right_on='id')
merged_df = merged_df.merge(circle_df, left_on='circle_id', right_on='id')
merged_df = merged_df.merge(kpi_df, left_on='kpi_id', right_on='id')

# Function to convert period_id to month-year or quarter-year format
def period_to_label(period_id, frequency_id):
    if frequency_id == 1:  # Monthly
        month = (period_id - 1) % 12 + 1
        year = 2023 + (period_id - 1) // 12
        return f'{month:02d}-{year}'
    elif frequency_id == 2:  # Quarterly
        quarter = (period_id - 1) % 4 + 1
        year = 2023 + (period_id - 1) // 12
        return f'Q{quarter}-{year}'
    else:
        return str(period_id)

# Improved Seaborn style
sns.set_style("whitegrid", {'axes.grid': True, 'grid.linestyle': '--', 'grid.color': '.8'})

# Enhanced color palette
palette = sns.color_palette("husl", 8)

# Set font details
font = {'family': 'Arial',  # Use a clear font family like Arial
        'weight': 'bold',
        'size': 18}

plt.rc('font', **font)  # Apply the font settings

# Group by circle
for circle_name, circle_group in merged_df.groupby(['name_x']):    
    # Create a new PDF for the circle
    with PdfPages(f'{circle_name.replace("/", "_").replace(" ", "_")}_report.pdf') as pdf:
        
        # For each KPI associated with the circle
        for kpi_name, kpi_group in circle_group.groupby(['name_y']):
            
            plt.figure(figsize=(16, 10))
            
            # Filter out rows with NaN values in 'value' column
            kpi_group = kpi_group.dropna(subset=['value'])
            
            # Convert period_id to month-year or quarter-year format
            labels = [period_to_label(pid, kpi_group['frequency_id'].iloc[0]) for pid in kpi_group['period_id']]
            
            # Plotting the data
            ax = sns.lineplot(x=labels, y=kpi_group['value'], marker='o', linewidth=2.5, color=palette[0], markersize=10)
            
            # Adding data point labels with annotations
            for i, value in enumerate(kpi_group['value']):
                if np.isfinite(value):
                    ax.annotate(f'{value:.2f}', (i, value), textcoords="offset points", xytext=(0,10), ha='center', fontsize=12, arrowprops=dict(arrowstyle="->", color=palette[0]), color=palette[0])
            
            plt.title(f'Circle: {circle_name} - KPI: {kpi_name}', fontsize=22, fontweight='bold', pad=25)
            plt.xlabel('Time Period', fontsize=20, labelpad=20)
            plt.ylabel('Value', fontsize=20, labelpad=20)
            plt.xticks(rotation=45, fontsize=18)
            plt.yticks(fontsize=18)
            plt.grid(True, which='both', linestyle='--', linewidth=0.5)
            plt.tight_layout()
            
            # Remove top and right spines
            sns.despine(top=True, right=True)

            # Remove legend if it exists
            legend = ax.get_legend()
            if legend:
                legend.remove()

            # Add the plot to the PDF
            pdf.savefig(plt.gcf(), bbox_inches='tight')    
                    
            # Add a description page for the KPI
            plt.figure(figsize=(16, 10))
            plt.axis('off')
            description = kpi_group['description'].iloc[0]
            plt.text(0.5, 0.5, f"Description of KPI '{kpi_name}':\n\n{description}", ha='center', va='center', wrap=True, fontsize=18)
            
            # Add the description page to the PDF
            pdf.savefig(plt.gcf(), bbox_inches='tight')
            
            plt.close()  # Close the current figure to free up memory
