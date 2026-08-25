import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace in ParticipantPayRow
content = content.replace(
    'const baseCuota = calcBaseCuota(paseo);',
    'const baseCuota = calcParticipantBaseCuota(paseo, participant?.id || currentUser?.id);'
)

# Replace in PDF
content = content.replace(
    'const cuota = calcBaseCuota(paseo) + calcBusAddonForPerson(paseo, p.id);',
    'const cuota = calcParticipantBaseCuota(paseo, p.id) + calcBusAddonForPerson(paseo, p.id);'
)

# Replace in WhatsApp
content = content.replace(
    'const cuota = calcBaseCuota(paseo) + calcBusAddonForPerson(paseo, participant.id);',
    'const cuota = calcParticipantBaseCuota(paseo, participant.id) + calcBusAddonForPerson(paseo, participant.id);'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated usage")
