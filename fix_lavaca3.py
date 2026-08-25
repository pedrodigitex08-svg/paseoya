import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Inside ParticipantPayRow
if 'const { lblAlojamiento' not in content.split('function ParticipantPayRow({')[1].split('return')[0]:
    content = content.replace(
        '  const isLocked = paseo?.estado === "finalizado";',
        '  const isLocked = paseo?.estado === "finalizado";\n  const { lblAlojamiento, lblMercado } = getLabels(paseo);'
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LaVaca.jsx ParticipantPayRow")
