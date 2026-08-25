import re

file_path = 'src/components/layout/BottomNav.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1">\n        const visibleTabs = isShortWithoutLogistics ? TABS.filter(t => t.id !== "logistica") : TABS;\n\n        {visibleTabs.map((tab) => {',
    '      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1">\n        {visibleTabs.map((tab) => {'
)

content = content.replace(
    '  return (\n    <nav',
    '  const visibleTabs = isShortWithoutLogistics ? TABS.filter(t => t.id !== "logistica") : TABS;\n\n  return (\n    <nav'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed BottomNav.jsx")
