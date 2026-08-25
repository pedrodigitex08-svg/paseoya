import re
import sys

file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert dynamic labels at the top of LaVaca function after isShortEvent
insert_idx = content.find('const isShortEvent =')
if insert_idx != -1:
    end_of_isShortEvent = content.find(';', insert_idx) + 1
    new_labels = '''
  let lblAlojamiento = "🏠 Alojamiento & Base";
  let lblMercado = "🛒 Comida y Mercado";
  let lblMercadoMini = "🛒 Mercado (Menú)";
  let lblPdfHospedaje = "Hospedaje Base:";
  let lblPdfMercado = "Mercado / Menu:";

  if (paseo.category === "regalo") {
    lblAlojamiento = "🎁 Meta del Regalo";
    lblMercado = "🛍️ Gastos Adicionales";
    lblMercadoMini = "🛍️ Gastos Extras";
    lblPdfHospedaje = "Meta del Regalo:";
    lblPdfMercado = "Gastos Adicionales:";
  } else if (paseo.category === "asado") {
    lblAlojamiento = "🔥 Presupuesto Asado";
    lblMercado = "🧊 Bebidas y Extras";
    lblMercadoMini = "🧊 Bebidas/Extras";
    lblPdfHospedaje = "Presupuesto Asado:";
    lblPdfMercado = "Extras (Bebidas, etc):";
  } else if (isShortEvent) {
    lblAlojamiento = "💸 Consumo Base";
    lblMercado = "🍸 Extras / Propinas";
    lblMercadoMini = "🍸 Extras / Propinas";
    lblPdfHospedaje = "Consumo Base:";
    lblPdfMercado = "Extras / Propinas:";
  }
'''
    # Check if already inserted
    if "lblAlojamiento =" not in content:
        content = content[:end_of_isShortEvent] + new_labels + content[end_of_isShortEvent:]

# 2. Replace hardcoded UI labels
content = re.sub(r'<p className="font-bold text-slate-700">🏠 Alojamiento & Base</p>', r'<p className="font-bold text-slate-700">{lblAlojamiento}</p>', content)
content = re.sub(r'<p className="font-bold text-slate-700">🛒 Comida y Mercado</p>', r'<p className="font-bold text-slate-700">{lblMercado}</p>', content)
content = re.sub(r'<span>🛒 Mercado \(Menú\)</span>', r'<span>{lblMercadoMini}</span>', content)

# 3. Replace PDF labels
content = re.sub(r'doc\.text\("Hospedaje Base:", margin \+ 4, y \+ 16\);', r'doc.text(lblPdfHospedaje, margin + 4, y + 16);', content)
content = re.sub(r'doc\.text\("Mercado / Menu:", margin \+ 4, y \+ 24\);', r'doc.text(lblPdfMercado, margin + 4, y + 24);', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LaVaca.jsx successfully")
