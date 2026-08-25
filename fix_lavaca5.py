import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific duplicate chunk
content = re.sub(
    r'  const isShortEvent =\s*paseo\.category === "rumba".*?lblPdfMercado = "Extras / Propinas:";\n    }',
    '  const { lblAlojamiento, lblMercado, lblMercadoMini, lblPdfHospedaje, lblPdfMercado } = getLabels(paseo);',
    content,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed duplicate logic properly")
