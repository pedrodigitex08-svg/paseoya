import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'usePaseoStore.getState().updatePaseo(paseo.slug, { participants: updatedParticipants });',
    'usePaseo.getState().updatePaseo(paseo.slug, { participants: updatedParticipants });'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed store reference")
