import re

file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add to isShortEvent
if 'paseo.category === "futbol"' not in content:
    content = re.sub(
        r'paseo\.category === "regalo";',
        r'paseo.category === "regalo" ||\n    paseo.category === "futbol";',
        content
    )

# 2. Add labels
if 'paseo.category === "futbol"' not in content:
    content = re.sub(
        r'if \(paseo\.category === "regalo"\) {',
        r'if (paseo.category === "futbol") {\n    lblAlojamiento = "⚽ Alquiler Cancha";\n    lblMercado = "🏃 Árbitro e Hidratación";\n    lblMercadoMini = "🏃 Árbitro e Hidratación";\n    lblPdfHospedaje = "Alquiler Cancha:";\n    lblPdfMercado = "Árbitro e Hidratación:";\n  } else if (paseo.category === "regalo") {',
        content
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LaVaca.jsx for Futbol")
