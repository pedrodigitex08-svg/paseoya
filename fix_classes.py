import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className={w-12 h-6 rounded-full transition-colors relative flex items-center p-1 }',
    'className={w-12 h-6 rounded-full transition-colors relative flex items-center p-1 }'
)

content = content.replace(
    'className={w-4 h-4 bg-white rounded-full transition-transform }',
    'className={w-4 h-4 bg-white rounded-full transition-transform }'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed classes")
