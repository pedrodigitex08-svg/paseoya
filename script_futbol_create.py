import re

file_path = 'src/pages/CreatePaseo.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Trophy to lucide-react imports
if 'Trophy' not in content:
    content = re.sub(r'  Gift,\n} from "lucide-react";', '  Gift,\n  Trophy,\n} from "lucide-react";', content)

# 2. Add futbol to CATEGORIES
futbol_cat = '''  {
    id: "futbol",
    label: "Fútbol 5",
    emoji: "⚽",
    icon: Trophy,
    grad: "from-emerald-400 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
];'''
if 'id: "futbol"' not in content:
    content = re.sub(r'\];', futbol_cat, content, count=1)

# 3. Add to isShortEvent
if 'cat.id === "futbol"' not in content:
    content = re.sub(r'cat\.id === "regalo";', 'cat.id === "regalo" ||\n                      cat.id === "futbol";', content)
if 'formData.categoria?.id === "futbol"' not in content:
    content = re.sub(r'formData\.categoria\?\.id === "regalo";', 'formData.categoria?.id === "regalo" ||\n    formData.categoria?.id === "futbol";', content)

# 4. Add labels
if 'if (formData.categoria?.id === "futbol")' not in content:
    content = re.sub(
        r'if \(formData\.categoria\?\.id === "regalo"\) {',
        r'if (formData.categoria?.id === "futbol") {\n    labelName = "Nombre del Partido";\n    placeholderName = "Ej: Los Malos vs Los Peores";\n  } else if (formData.categoria?.id === "regalo") {',
        content
    )
    content = re.sub(
        r'if \(formData\.categoria\?\.id === "regalo"\) {',
        r'if (formData.categoria?.id === "futbol") {\n    labelLocation = "Cancha / Sede";\n    placeholderLocation = "Ej: Canchas Campín 5";\n  } else if (formData.categoria?.id === "regalo") {',
        content
    )
    content = re.sub(
        r'if \(formData\.categoria\?\.id === "regalo"\) {',
        r'if (formData.categoria?.id === "futbol") {\n    labelBudget = "Costo Cancha + Árbitro";\n  } else if (formData.categoria?.id === "regalo") {',
        content
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated CreatePaseo.jsx for Futbol")
