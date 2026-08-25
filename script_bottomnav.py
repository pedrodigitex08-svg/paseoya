import re

file_path = 'src/components/layout/BottomNav.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Filter TABS based on category
if 'const paseo = state.activePaseo;' not in content:
    content = re.sub(
        r'const \{ state \} = usePaseo\(\);',
        r'const { state } = usePaseo();\n  const paseo = state.activePaseo;\n  const isShortWithoutLogistics = paseo?.category === "rumba" || paseo?.category === "restaurante" || paseo?.category === "regalo";',
        content
    )

if 'const visibleTabs = TABS.filter' not in content:
    content = re.sub(
        r'\{TABS\.map\(\(tab\) => \{',
        r'const visibleTabs = isShortWithoutLogistics ? TABS.filter(t => t.id !== "logistica") : TABS;\n\n        {visibleTabs.map((tab) => {',
        content
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated BottomNav.jsx for Logistics hiding")
