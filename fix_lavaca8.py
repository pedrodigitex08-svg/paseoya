import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('  }\n\n\n  const orgPct', '\n  const orgPct')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed extra bracket")
