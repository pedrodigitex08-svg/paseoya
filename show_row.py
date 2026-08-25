file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if line.startswith('function ParticipantPayRow'):
        start_idx = i
        break

if start_idx != -1:
    print("".join(lines[start_idx:start_idx+60]))
