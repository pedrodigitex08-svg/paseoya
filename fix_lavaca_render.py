import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add states
content = content.replace(
    'const currentUser = state.currentUser;',
    'const currentUser = state.currentUser;\n  const [settingsParticipant, setSettingsParticipant] = useState(null);'
)

# Render Modal
content = content.replace(
    '<BottomNav />',
    '{settingsParticipant && (\n        <ParticipantSettingsModal \n          participant={settingsParticipant} \n          paseo={paseo}\n          onClose={() => setSettingsParticipant(null)}\n        />\n      )}\n      <BottomNav />'
)

# Pass onOpenSettings to ParticipantPayRow
content = content.replace(
    '<ParticipantPayRow\n                        key={p.id}\n                        participant={p}\n                        paseo={paseo}\n                        currentUser={currentUser}\n                        onToggle={toggleParticipantPaid}\n                        isLocked={isLocked}\n                      />',
    '<ParticipantPayRow\n                        key={p.id}\n                        participant={p}\n                        paseo={paseo}\n                        currentUser={currentUser}\n                        onToggle={toggleParticipantPaid}\n                        isLocked={isLocked}\n                        onOpenSettings={setSettingsParticipant}\n                      />'
)

# wait, how is ParticipantPayRow rendered currently?
