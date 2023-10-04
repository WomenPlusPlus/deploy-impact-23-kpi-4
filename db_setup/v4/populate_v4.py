#%%
from sqlalchemy import create_engine, MetaData, Table, select, insert
from sqlalchemy.exc import IntegrityError
import csv

# Database connection parameters
DATABASE_URI = 'postgresql://postgres:Avenu1@localhost/deploy_impact_staging_v4'

# Create an engine and metadata object
engine = create_engine(DATABASE_URI)
metadata = MetaData()
metadata.bind = engine  # Bind the engine to the metadata object

# Reflect the tables
users = Table('users', metadata, autoload_with=engine)
circles = Table('circle', metadata, autoload_with=engine)
kpis = Table('kpi', metadata, autoload_with=engine)
circle_kpi = Table('circle_kpi', metadata, autoload_with=engine)
periods = Table('period', metadata, autoload_with=engine)
audits = Table('audit', metadata, autoload_with=engine)

# Open the CSV file and read each row
with open('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-kpi/db_setup/v3/pj_sample_value - pj_sample_value.csv', mode='r') as file:
    reader = csv.DictReader(file)
    
    with engine.connect() as connection:
        for row in reader:
            try:
                # Check if user exists, if not create
                user_result = connection.execute(select(users.c.id).where(users.c.email == row['user'])).fetchone()
                if not user_result:
                    user_result = connection.execute(insert(users).values(email=row['user'], username=row['user'], role_id=None)).inserted_primary_key

                # Check if circle exists, if not create
                circle_result = connection.execute(select(circles.c.id).where(circles.c.name == row['circle'])).fetchone()
                if not circle_result:
                    circle_result = connection.execute(insert(circles).values(name=row['circle'])).inserted_primary_key

                # Check if kpi exists, if not create
                kpi_result = connection.execute(select(kpis.c.id).where(kpis.c.name == row['kpi'])).fetchone()
                if not kpi_result:
                    kpi_result = connection.execute(insert(kpis).values(name=row['kpi'], range=row['range'], periodicity=row['periodicity'])).inserted_primary_key

                # Check if period exists, if not create
                period_result = connection.execute(select(periods.c.id).where((periods.c.year == int(row['period_year'])) & (periods.c.month == int(row['period_month'])))).fetchone()
                if not period_result:
                    period_result = connection.execute(insert(periods).values(year=int(row['period_year']), month=int(row['period_month']))).inserted_primary_key

                # Insert into audits
                connection.execute(insert(audits).values(circle_kpi_id=None, user_id=user_result[0], period_id=period_result[0], value=row['value']))

                # Commit the transaction
                connection.commit()
                
            except IntegrityError as e:
                print(f"Integrity Error: {e}")
                connection.rollback()
            except Exception as e:
                print(f"Error: {e}")
                connection.rollback()
