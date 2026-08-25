import re
file_path = 'src/pages/Logistics.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

tabs_replacement = '''{[
            isFutbol 
              ? { id: "alineacion", label: "⚽ Alineación" } 
              : { id: "menu", label: "🛒 " + (isAsado ? "Carnes y Bebidas" : "Menú y Bebidas") },
            (!isFutbol) && { id: "transporte", label: "🚐 Transporte" },
          ].filter(Boolean).map((tab) => ('''
    
content = re.sub(
    r'\{\[\n\s*\{ id: "menu", label: "🛒 Menú y Bebidas" \},\n\s*\{ id: "transporte", label: "🚐 Transporte" \},\n\s*\]\.map\(\(tab\) => \(',
    tabs_replacement,
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
