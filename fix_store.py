import re
file_path = 'src/store/usePaseoStore.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const category = data.categoria || data.category || "finca";',
    'const category = (typeof data.categoria === "object" ? data.categoria.id : data.categoria) || data.category || "finca";'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated usePaseoStore.jsx")
