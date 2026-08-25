import sys
import re

with open('src/pages/Voting.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 2. Update DateVoteCard Props
content = re.sub(
    r'function DateVoteCard\(\{\s*date,\s*votes,\s*userVote,\s*totalParticipants,',
    r'function DateVoteCard({\n  date,\n  votes,\n  userVote,\n  totalParticipants,\n  participants,',
    content
)

# 3. Update DateVoteCard Avatars
# Yes votes
content = re.sub(
    r'(<span className="text-\[11px\] font-bold text-slate-500">\s*\{votes\.yes\} voto\{votes\.yes !== 1 \? "s" : ""\} • \{yesWidth\}%\s*</span>\s*</div>)\s*(<div className="h-2 bg-slate-100 rounded-full overflow-hidden">)',
    r'\1\n          <AvatarList userIds={votes.yesUsers} participants={participants} />\n          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">',
    content
)

# No votes
content = re.sub(
    r'(<span className="text-\[11px\] font-bold text-slate-500">\s*\{votes\.no\} voto\{votes\.no !== 1 \? "s" : ""\} • \{noWidth\}%\s*</span>\s*</div>)\s*(<div className="h-2 bg-slate-100 rounded-full overflow-hidden">)',
    r'\1\n          <AvatarList userIds={votes.noUsers} participants={participants} />\n          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">',
    content
)

# 4. Pass participants to DateVoteCard where called
content = re.sub(
    r'(<DateVoteCard[^>]*?totalParticipants=\{paseo\.participants\.length\})',
    r'\1\n                    participants={paseo.participants}',
    content
)

# 5. Update PlaceVoteCard Props
content = re.sub(
    r'function PlaceVoteCard\(\{\s*place,\s*votes,\s*userVote,\s*index,\s*isWinner,\s*isVotingLocked,\s*onVote,\s*onRemove,',
    r'function PlaceVoteCard({\n  place,\n  votes,\n  userVote,\n  index,\n  isWinner,\n  isVotingLocked,\n  onVote,\n  onRemove,\n  participants,',
    content
)

# 6. Update PlaceVoteCard Avatars
# Likes
content = re.sub(
    r'(<span className="text-sm font-bold text-slate-700">)\s*(\{votes\.likes\})\s*(</span>)',
    r'<span className="text-sm font-bold text-slate-700 flex items-center gap-2">\n              {votes.likes}\n              <AvatarList userIds={votes.likesUsers} participants={participants} />\n            </span>',
    content
)

# Dislikes
content = re.sub(
    r'(<span className="text-sm font-bold text-slate-700">)\s*(\{votes\.dislikes\})\s*(</span>)',
    r'<span className="text-sm font-bold text-slate-700 flex items-center gap-2">\n              {votes.dislikes}\n              <AvatarList userIds={votes.dislikesUsers} participants={participants} />\n            </span>',
    content
)

# 7. Pass participants to PlaceVoteCard where called
content = re.sub(
    r'(<PlaceVoteCard[^>]*?onRemove=\{removePlace\})',
    r'\1\n                      participants={paseo.participants}',
    content
)

with open('src/pages/Voting.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Voting patched with regex")
