import re
file_path = 'src/pages/Dashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add labels logic to Dashboard.jsx
if 'let labelLocation = "Destino Original";' not in content:
    labels_logic = '''
  let labelLocation = "Destino Original";
  let labelBudget = "Presupuesto";
  const isShortEvent = paseo?.category === "rumba" || paseo?.category === "restaurante" || paseo?.category === "asado" || paseo?.category === "regalo" || paseo?.category === "futbol";
  
  if (paseo?.category === "futbol") {
    labelLocation = "Cancha / Sede";
    labelBudget = "Costo Cancha + Árbitro";
  } else if (paseo?.category === "regalo") {
    labelLocation = "Lugar de entrega";
    labelBudget = "Meta del Regalo (Total)";
  } else if (paseo?.category === "asado") {
    labelLocation = "Destino / Lugar";
    labelBudget = "Presupuesto Carnes/Bebidas";
  } else if (isShortEvent) {
    labelLocation = "Lugar o ubicación";
    labelBudget = "Cover o Consumo estimado";
  }
'''
    content = re.sub(
        r'const isLocked = paseo\?\.estado === "finalizado";',
        r'const isLocked = paseo?.estado === "finalizado";\n' + labels_logic,
        content
    )

    # Replace hardcoded text
    content = re.sub(
        r'<p className="text-\[10px\] font-bold text-slate-400 uppercase">\s*Destino Original\s*</p>',
        r'<p className="text-[10px] font-bold text-slate-400 uppercase">\n                {labelLocation}\n              </p>',
        content
    )
    
    content = re.sub(
        r'<p className="text-\[10px\] font-bold text-slate-400 uppercase">\s*Presupuesto\s*</p>',
        r'<p className="text-[10px] font-bold text-slate-400 uppercase">\n                {labelBudget}\n              </p>',
        content
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Dashboard.jsx")
