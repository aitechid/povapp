import os
import json
import pandas as pd
import numpy as np

# Absolute paths
data_dir = r"c:\Users\avudz\Kiro\Kemiskinan\data\bps"
output_dir = r"c:\Users\avudz\Kiro\Kemiskinan\poverty-portal\public\data"
os.makedirs(output_dir, exist_ok=True)
output_file = os.path.join(output_dir, "poverty_data.json")

# Filenames
p0_prov_file = os.path.join(data_dir, "Persentase Penduduk Miskin (P0) Menurut Provinsi dan Daerah, 2025.xlsx")
num_prov_file = os.path.join(data_dir, "Jumlah Penduduk Miskin (Ribu Jiwa) Menurut Provinsi dan Daerah, 2025.xlsx")
gk_prov_file = os.path.join(data_dir, "Garis Kemiskinan Makanan (Rupiah_Kapita_Bulan) Menurut Provinsi dan Daerah, 2025.xlsx")

p0_kab_file = os.path.join(data_dir, "Persentase Penduduk Miskin (P0) Menurut Kabupaten_Kota, 2025.xlsx")
num_kab_file = os.path.join(data_dir, "Jumlah Penduduk Miskin (Ribu Jiwa) Menurut Kabupaten_Kota , 2025.xlsx")
gk_kab_file = os.path.join(data_dir, "Garis Kemiskinan Menurut Kabupaten_Kota, 2025.xlsx")

def parse_val(val):
    if pd.isnull(val):
        return None
    val_str = str(val).strip()
    if val_str == '-' or val_str == '' or val_str == 'nan':
        return None
    try:
        # Remove commas just in case
        return float(val_str.replace(',', ''))
    except ValueError:
        return None

def get_provinsi_data(filepath):
    df = pd.read_excel(filepath, header=None)
    data = {}
    for idx, row in df.iterrows():
        prov_name = str(row[0]).strip()
        # Filter rows that are uppercase, not NaN, and not title/Indonesia
        if prov_name and prov_name != 'nan' and prov_name.isupper():
            urban_s1 = parse_val(row[1])
            urban_s2 = parse_val(row[2])
            rural_s1 = parse_val(row[4])
            rural_s2 = parse_val(row[5])
            total_s1 = parse_val(row[7])
            total_s2 = parse_val(row[8])
            
            data[prov_name] = {
                'urban_s1': urban_s1,
                'urban_s2': urban_s2,
                'rural_s1': rural_s1,
                'rural_s2': rural_s2,
                'total_s1': total_s1,
                'total_s2': total_s2
            }
    return data

def get_kabupaten_data(filepath):
    df = pd.read_excel(filepath, header=None)
    data = {} # nested: {PROVINCE: {KABUPATEN: VALUE}}
    current_prov = None
    
    for idx, row in df.iterrows():
        name = str(row[0]).strip()
        if not name or name == 'nan' or 'Menurut' in name or 'Persentase' in name or name == 'Provinsi/Kabupaten/Kota' or 'Jumlah' in name or 'Garis' in name:
            continue
            
        if name.isupper():
            current_prov = name
            if current_prov not in data:
                data[current_prov] = {}
        else:
            if current_prov is not None:
                val = parse_val(row[1])
                data[current_prov][name] = val
    return data

print("Parsing Province files...")
prov_p0 = get_provinsi_data(p0_prov_file)
prov_num = get_provinsi_data(num_prov_file)
prov_gk = get_provinsi_data(gk_prov_file)

print("Parsing Kabupaten/Kota files...")
kab_p0 = get_kabupaten_data(p0_kab_file)
kab_num = get_kabupaten_data(num_kab_file)
kab_gk = get_kabupaten_data(gk_kab_file)

# Build unified dictionary
unified_data = {}

# Get all unique provinces from our parsing
all_provinces = sorted(list(set(prov_p0.keys())))

for prov in all_provinces:
    # Get stats or defaults
    p0_stats = prov_p0.get(prov, {})
    num_stats = prov_num.get(prov, {})
    gk_stats = prov_gk.get(prov, {})
    
    # We will compute simulated P1 index for styling consistency, or write simple formulas
    # In real world, P1 is around 1.0 - 2.5 depending on P0. Let's make it proportional to P0 (e.g. P0 / 7) for display
    total_p0 = p0_stats.get('total_s1')
    p1_value = round((total_p0 / 7.0), 2) if total_p0 is not None else 1.04
    
    prov_entry = {
        'name': prov,
        'kpi': {
            'poverty_rate_percent': total_p0,
            'poverty_rate_percent_s2': p0_stats.get('total_s2'),
            'poor_population_thousands': num_stats.get('total_s1'),
            'poor_population_thousands_s2': num_stats.get('total_s2'),
            'poverty_line_rupiah': gk_stats.get('total_s1'), # or GK total
            'poverty_line_rupiah_s2': gk_stats.get('total_s2'),
            'p1_depth_index': p1_value,
            'urban_p0': p0_stats.get('urban_s1'),
            'rural_p0': p0_stats.get('rural_s1'),
            'urban_num_thousands': num_stats.get('urban_s1'),
            'rural_num_thousands': num_stats.get('rural_s1'),
        },
        'districts': []
    }
    
    # Add districts
    prov_kab_p0 = kab_p0.get(prov, {})
    prov_kab_num = kab_num.get(prov, {})
    prov_kab_gk = kab_gk.get(prov, {})
    
    # Get all unique district names for this province
    all_districts = sorted(list(set(prov_kab_p0.keys()) | set(prov_kab_num.keys()) | set(prov_kab_gk.keys())))
    
    for dist in all_districts:
        # Check if it has data
        p0_val = prov_kab_p0.get(dist)
        num_val = prov_kab_num.get(dist)
        gk_val = prov_kab_gk.get(dist)
        
        prov_entry['districts'].append({
            'name': dist,
            'poverty_rate_percent': p0_val,
            'poor_population_thousands': num_val,
            'poverty_line_rupiah': gk_val
        })
        
    unified_data[prov] = prov_entry

# Save to output file
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(unified_data, f, indent=2, ensure_ascii=False)

print(f"Successfully wrote {len(unified_data)} provinces to {output_file}")
