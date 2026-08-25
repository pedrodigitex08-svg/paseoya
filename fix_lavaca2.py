import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The logic block
logic_block = '''
const getLabels = (paseo) => {
  const isShortEvent =
    paseo?.category === "rumba" ||
    paseo?.category === "restaurante" ||
    paseo?.category === "asado" ||
    paseo?.category === "regalo" ||
    paseo?.category === "futbol";

  let lblAlojamiento = "🏠 Alojamiento & Base";
  let lblMercado = "🛒 Comida y Mercado";
  let lblMercadoMini = "🛒 Mercado (Menú)";
  let lblPdfHospedaje = "Hospedaje Base:";
  let lblPdfMercado = "Mercado / Menu:";

  if (paseo?.category === "futbol") {
    lblAlojamiento = "⚽ Alquiler Cancha";
    lblMercado = "⏱️ Árbitro e Hidratación";
    lblMercadoMini = "⏱️ Árbitro e Hidratación";
    lblPdfHospedaje = "Alquiler Cancha:";
    lblPdfMercado = "Árbitro e Hidratación:";
  } else if (paseo?.category === "regalo") {
    lblAlojamiento = "🎁 Meta del Regalo";
    lblMercado = "🎀 Gastos Adicionales";
    lblMercadoMini = "🎀 Gastos Extras";
    lblPdfHospedaje = "Meta del Regalo:";
    lblPdfMercado = "Gastos Adicionales:";
  } else if (paseo?.category === "asado") {
    lblAlojamiento = "🔥 Presupuesto Asado";
    lblMercado = "🍻 Bebidas y Extras";
    lblMercadoMini = "🍻 Bebidas/Extras";
    lblPdfHospedaje = "Presupuesto Asado:";
    lblPdfMercado = "Extras (Bebidas, etc):";
  } else if (isShortEvent) {
    lblAlojamiento = "💸 Consumo Base";
    lblMercado = "💰 Extras / Propinas";
    lblMercadoMini = "💰 Extras / Propinas";
    lblPdfHospedaje = "Consumo Base:";
    lblPdfMercado = "Extras / Propinas:";
  }
  
  return { lblAlojamiento, lblMercado, lblMercadoMini, lblPdfHospedaje, lblPdfMercado };
};
'''

# 1. Insert getLabels before export default function LaVaca()
if 'const getLabels =' not in content:
    content = content.replace('export default function LaVaca() {', logic_block + '\nexport default function LaVaca() {')

# 2. Update all places that need the labels.
# TicketSummary? Let's check how many components use it.
content = re.sub(
    r'let lblAlojamiento = "🏠 Alojamiento & Base";.*?(?=const orgPct = calcOrgPercentage\(paseo\);)',
    'const { lblAlojamiento, lblMercado, lblMercadoMini, lblPdfHospedaje, lblPdfMercado } = getLabels(paseo);\n  ',
    content,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LaVaca.jsx with getLabels")
