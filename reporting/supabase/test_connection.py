#%%
from importlib import reload
import supabase_py
reload(supabase_py)
from supabase_py import create_client

url = "https://rwgvhztztzdcbwolbkfw.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Z3ZoenR6dHpkY2J3b2xia2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzM1MDgsImV4cCI6MjAxMTI0OTUwOH0.ZI_vUcgvc8C8m5epGokVzSibB2a853z4yYSdQzYUua0"  # Make sure not to expose your keys publicly
supabase = create_client(url, key)

# Fetch data
response = supabase.table('circle').select('*').execute()
data = response['data']
print(data)
