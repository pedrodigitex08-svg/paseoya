import re

file_path = 'src/pages/GuestDashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'\{!isShortEvent && \(\n\s*<QuickAction\n\s*icon=\{ShoppingBasket\}\n\s*label="Logística y Transporte"',
    r'{(!isShortEvent || paseo.category === "asado" || paseo.category === "futbol") && (\n                <QuickAction\n                  icon={ShoppingBasket}\n                  label={paseo.category === "futbol" ? "Alineación" : (paseo.category === "asado" ? "¿Quién lleva qué?" : "Logística y Transporte")}',
    content
)
# Update sublabel too
content = re.sub(
    r'sublabel="Ingredientes, carros y buseta"',
    r'sublabel={paseo.category === "futbol" ? "Elige tu posición en la cancha" : (paseo.category === "asado" ? "Organiza carnes y bebidas" : "Ingredientes, carros y buseta")}',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Logistics button in GuestDashboard")
