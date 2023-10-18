#%%
import pandas as pd

# Step 1: Read each CSV file into its own DataFrame

audit_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Audit.csv')
circle_kpi_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Circle_KPI.csv')
circle_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Circle.csv')
frequency_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Frequency.csv')
kpi_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/KPI.csv')
period_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Period.csv')
range_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Range.csv')
role_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Role.csv')
users_df = pd.read_csv('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-23-kpi-4/db_setup/data_split/Users.csv')

# Step 2: Merge these DataFrames into a single DataFrame

# Starting with the Audit table, merge with other tables based on foreign keys
merged_df = audit_df.merge(circle_kpi_df, left_on='circle_kpi_id', right_on='id', suffixes=('', '_circle_kpi'))
merged_df = merged_df.merge(circle_df, left_on='circle_id', right_on='id', suffixes=('', '_circle'))
merged_df = merged_df.merge(kpi_df, left_on='kpi_id', right_on='id', suffixes=('', '_kpi'))
merged_df = merged_df.merge(period_df, left_on='period_id', right_on='id', suffixes=('', '_period'))
merged_df = merged_df.merge(range_df, left_on='range_id', right_on='id', suffixes=('', '_range'))
merged_df = merged_df.merge(frequency_df, left_on='frequency_id', right_on='id', suffixes=('', '_frequency'))
merged_df = merged_df.merge(users_df, left_on='user_id', right_on='id', suffixes=('', '_users'))
merged_df = merged_df.merge(role_df, left_on='role_id', right_on='id', suffixes=('', '_role'))

# Drop the duplicate id columns
cols_to_drop = [col for col in merged_df.columns if '_id' in col and col != 'id']
merged_df.drop(columns=cols_to_drop, inplace=True)
# Save the merged DataFrame to a CSV file
merged_df = merged_df.sort_values(by='id')
merged_df.to_csv('merged_output.csv', index=False)

print(merged_df)
