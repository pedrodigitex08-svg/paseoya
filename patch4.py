import sys
import re

with open('src/pages/Voting.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Yes votes
content = re.sub(
    r'(<span className="text-\[11px\] font-bold text-slate-500">\s*\{votes\.yes\} voto\{votes\.yes !== 1 \? "s" : ""\}.*?\{yesWidth\}%\s*</span>\s*</div>)\s*(<div className="h-2 bg-slate-100 rounded-full overflow-hidden">)',
    r'\1\n          <AvatarList userIds={votes.yesUsers} participants={participants} />\n          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">',
    content,
    flags=re.DOTALL
)

# No votes
content = re.sub(
    r'(<span className="text-\[11px\] font-bold text-slate-500">\s*\{votes\.no\} voto\{votes\.no !== 1 \? "s" : ""\}.*?\{noWidth\}%\s*</span>\s*</div>)\s*(<div className="h-2 bg-slate-100 rounded-full overflow-hidden">)',
    r'\1\n          <AvatarList userIds={votes.noUsers} participants={participants} />\n          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">',
    content,
    flags=re.DOTALL
)

with open('src/pages/Voting.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Voting patched with ANY character regex")
