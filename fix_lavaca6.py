import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Just replace the duplicated block inside LaVaca component.
# It starts at: const isShortEvent = paseo.category
# and ends right before: const orgPct = calcOrgPercentage(paseo);
content = re.sub(
    r'  const isShortEvent =\s*paseo\.category[\s\S]*?(?=  const orgPct = calcOrgPercentage\(paseo\);)',
    '  const { lblAlojamiento, lblMercado, lblMercadoMini, lblPdfHospedaje, lblPdfMercado } = getLabels(paseo);\n',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed duplicate logic properly")
