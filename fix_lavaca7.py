file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We need to delete lines 1289 to 1324 (index 1288 to 1323)
del lines[1288:1324]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Deleted duplicate lines")
