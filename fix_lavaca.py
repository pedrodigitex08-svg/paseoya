import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<p className="font-bold text-slate-700">🏡 Alojamiento & Base</p>',
    '<p className="font-bold text-slate-700">{lblAlojamiento}</p>'
)

content = content.replace(
    '<p className="font-bold text-slate-700">🛒 Comida y Mercado</p>',
    '<p className="font-bold text-slate-700">{lblMercado}</p>'
)

content = content.replace(
    '<p className="font-bold text-slate-800">🛒 Mercado (Menú)</p>',
    '<p className="font-bold text-slate-800">{lblMercadoMini}</p>'
)

content = content.replace(
    '["Hospedaje Base:",',
    '[lblPdfHospedaje,'
)

content = content.replace(
    '["Mercado / Menu:",',
    '[lblPdfMercado,'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LaVaca.jsx")
