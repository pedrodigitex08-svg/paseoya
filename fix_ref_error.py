file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'const recaudoPct = calcRecaudo(paseo);' in line:
        lines[i+1] = '  const baseCuota = calcParticipantBaseCuota(paseo, currentUser?.id);\n'

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Fixed ReferenceError")
