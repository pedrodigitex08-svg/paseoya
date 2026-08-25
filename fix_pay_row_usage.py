import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'isLocked={isLocked}',
    'isLocked={isLocked}\n                      onOpenSettings={setSettingsParticipant}'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ParticipantPayRow usage")
