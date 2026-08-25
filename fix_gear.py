file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '{currentUser?.id === paseo.creator && (',
    '{!isLocked && ('
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed creator restriction for Settings icon")
