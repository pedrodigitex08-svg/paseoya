import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add SettingsIcon to LucideReact imports
if 'Settings,' not in content:
    content = content.replace('X,', 'X, Settings,')
    content = content.replace('Edit,', 'Edit, Settings,')

row_signature = r'function ParticipantPayRow\(\{[\s\S]*?\}\) \{'
new_signature = '''function ParticipantPayRow({
  participant,
  paseo,
  onToggle,
  currentUser,
  isLocked,
  onOpenSettings,
}) {'''
content = re.sub(row_signature, new_signature, content)

# Add gear icon next to the name
gear_html = '''
            {currentUser?.id === paseo.creator && (
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenSettings(participant); }}
                className="p-1 text-slate-400 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50"
              >
                <Settings size={12} />
              </button>
            )}
            <div className="w-full mt-0.5 flex gap-2 text-[10px] text-slate-400">
              <span>{participant.daysStayed ?? getTripDays(paseo)} das</span>
              <span>&middot;</span>
              <span>{participant.drinksAlcohol !== false ? "🍸 Toma licor" : "🚫 Sin licor"}</span>
            </div>
'''
# I'll inject gear_html after ANFITRION span.
content = content.replace(
    'ANFITRIÓN\n              </span>\n            )}',
    'ANFITRIÓN\n              </span>\n            )}\n' + gear_html
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ParticipantPayRow")
