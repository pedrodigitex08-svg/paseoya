import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the old logic inside LaVaca
content = re.sub(
    r'  const isShortEvent =[\s\S]*?(?=  const orgPct = calcOrgPercentage\(paseo\);)',
    r'  const { lblAlojamiento, lblMercado, lblMercadoMini, lblPdfHospedaje, lblPdfMercado } = getLabels(paseo);\n',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed duplicate logic in LaVaca")
