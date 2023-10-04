#%%
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.exc import IntegrityError
import csv

# Database connection parameters
DATABASE_URI = 'postgresql://postgres:Avenu1@localhost/deploy_impact_staging'

# Create an engine and metadata object
engine = create_engine(DATABASE_URI)
metadata = MetaData()
metadata.bind = engine  # Bind the engine to the metadata object

# Reflect the tables
users = Table('users', metadata, autoload_with=engine)
circles = Table('circles', metadata, autoload_with=engine)
kpis = Table('kpis', metadata, autoload_with=engine)
circle_kpi = Table('circle_kpi', metadata, autoload_with=engine)
periods = Table('periods', metadata, autoload_with=engine)
audits = Table('audits', metadata, autoload_with=engine)
datapoints = Table('datapoints', metadata, autoload_with=engine)

# Open the CSV file and read each row
with open('/Users/cliveulyate/Documents/Git_Pers/deploy-impact-kpi/db_setup/v3/pj_sample_value - pj_sample_value.csv', mode='r') as file:
    reader = csv.DictReader(file)
    
    with engine.connect() as connection:
        for row in reader:
            try:
                # Insert user if not exists
                user_id = connection.execute(users.select().where(users.c.email == row['user'])).scalar_one_or_none()
                if not user_id:
                    user_id = connection.execute(users.insert().values(
                        username=row['user'].split('@')[0], email=row['user'], role=row['role']
                    )).inserted_primary_key[0]
                print(f"User ID: {user_id}")
                
                # Insert circle if not exists
                circle_id = connection.execute(circles.select().where(circles.c.name == row['circle'])).scalar_one_or_none()
                if not circle_id:
                    circle_id = connection.execute(circles.insert().values(name=row['circle'])).inserted_primary_key[0]
                print(f"Circle ID: {circle_id}")
                
                # Insert kpi if not exists
                kpi_id = connection.execute(kpis.select().where(kpis.c.name == row['kpi'])).scalar_one_or_none()
                if not kpi_id:
                    kpi_id = connection.execute(kpis.insert().values(
                        name=row['kpi'], range=row['range'], periodicity=row['periodicity']
                    )).inserted_primary_key[0]
                print(f"KPI ID: {kpi_id}")
                
                # Insert circle_kpi if not exists
                circle_kpi_id = connection.execute(circle_kpi.select().where(
                    (circle_kpi.c.circle_id == circle_id) & (circle_kpi.c.kpi_id == kpi_id)
                )).scalar_one_or_none()
                if not circle_kpi_id:
                    circle_kpi_id = connection.execute(circle_kpi.insert().values(
                        circle_id=circle_id, kpi_id=kpi_id
                    )).inserted_primary_key[0]
                print(f"Circle KPI ID: {circle_kpi_id}")
                
                # Insert period if not exists
                period_id = connection.execute(periods.select().where(
                    (periods.c.year == row['period_year']) & (periods.c.month == row['period_month'])
                )).scalar_one_or_none()
                if not period_id:
                    period_id = connection.execute(periods.insert().values(
                        year=row['period_year'], month=row['period_month']
                    )).inserted_primary_key[0]
                print(f"Period ID: {period_id}")
                
                # Insert into audits and datapoints if value is present
                if row['value']:
                    audit_id = connection.execute(audits.insert().values(
                        circle_kpi_id=circle_kpi_id, user_id=user_id, value=row['value']
                    )).inserted_primary_key[0]
                    print(f"Audit ID: {audit_id}")
                    
                    connection.execute(datapoints.insert().values(
                        circle_kpi_id=circle_kpi_id, period_id=period_id, value_id=audit_id
                    ))
                    
                # Commit the transaction
                connection.commit()
                
            except IntegrityError as e:
                print(f"Integrity Error: {e}")
                connection.rollback()
            except Exception as e:
                print(f"Error: {e}")
                connection.rollback()