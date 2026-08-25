import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const currentUser = state.currentUser;',
    'const currentUser = state.currentUser;\n  const [settingsParticipant, setSettingsParticipant] = useState(null);'
)

content = content.replace(
    '<BottomNav />',
    '{settingsParticipant && (\n        <ParticipantSettingsModal \n          participant={settingsParticipant} \n          paseo={paseo}\n          onClose={() => setSettingsParticipant(null)}\n        />\n      )}\n      <BottomNav />'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected state and modal")
