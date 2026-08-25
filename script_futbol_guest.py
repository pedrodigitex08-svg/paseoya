import re

file_path = 'src/pages/GuestDashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add style
if 'futbol:' not in content:
    content = re.sub(
        r'regalo: \{ from: "#A855F7", to: "#7E22CE", label: "Regalo" \},',
        r'regalo: { from: "#A855F7", to: "#7E22CE", label: "Regalo" },\n  futbol: { from: "#10B981", to: "#047857", label: "Fútbol 5" },',
        content
    )

# 2. Add to isShortEvent
if 'paseo.category === "futbol"' not in content:
    content = re.sub(
        r'paseo\.category === "regalo";',
        r'paseo.category === "regalo" ||\n    paseo.category === "futbol";',
        content
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated GuestDashboard.jsx for Futbol")
