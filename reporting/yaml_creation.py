#%%
import pandas as pd
import yaml

# Load CSV files into pandas DataFrames
audit_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Audit.csv')
circle_kpi_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Circle_KPI.csv')
circle_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Circle.csv')
kpi_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/KPI.csv')

# Merge DataFrames to get required data for each circle
merged_df = audit_df.merge(circle_kpi_df, left_on='circle_kpi_id', right_on='id')
merged_df = merged_df.merge(circle_df, left_on='circle_id', right_on='id')
merged_df = merged_df.merge(kpi_df, left_on='kpi_id', right_on='id')

# Extract unique circles and their associated KPIs
circle_kpi_map = {}
for circle_name, circle_group in merged_df.groupby(['name_x']):
    circle_kpi_map[circle_name] = circle_group['name_y'].unique().tolist()

# Write to config.yaml
with open('config.yaml', 'w') as f:
    yaml.dump(circle_kpi_map, f, default_flow_style=False)
