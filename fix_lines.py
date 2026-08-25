file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

lines[1331] = '              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${drinks ? "bg-indigo-500" : "bg-slate-300"}`}\n'
lines[1333] = '              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${drinks ? "translate-x-6" : "translate-x-0"}`} />\n'

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Replaced lines properly")
