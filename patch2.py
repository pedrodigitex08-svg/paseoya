import sys

with open('src/pages/Voting.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add AvatarList helper
avatar_helper = '''
const AvatarList = ({ userIds, participants }) => {
  if (!userIds || userIds.length === 0 || !participants) return null;
  return (
    <div className="flex -space-x-1.5 mt-1">
      {userIds.map(id => {
        const p = participants.find(x => x.id === id);
        if (!p) return null;
        return (
          <div
            key={id}
            className="w-5 h-5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[8px] font-bold text-slate-600 shadow-sm"
            title={p.name}
          >
            {p.name.charAt(0).toUpperCase()}
          </div>
        );
      })}
    </div>
  );
};
'''

if 'const AvatarList = ' not in content:
    content = content.replace('// HELPERS', '// HELPERS\n' + avatar_helper)


# 2. Update DateVoteCard Props
content = content.replace('''  function DateVoteCard({
    date,
    votes,
    userVote,
    totalParticipants,''', '''  function DateVoteCard({
    date,
    votes,
    userVote,
    totalParticipants,
    participants,''')

# 3. Update DateVoteCard Avatars
# Search for the yes rendering inside DateVoteCard
content = content.replace('''              <span className="text-[11px] font-bold text-slate-500">
                {votes.yes} voto{votes.yes !== 1 ? "s" : ""} • {yesWidth}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">''', '''              <span className="text-[11px] font-bold text-slate-500">
                {votes.yes} voto{votes.yes !== 1 ? "s" : ""} • {yesWidth}%
              </span>
            </div>
            <AvatarList userIds={votes.yesUsers} participants={participants} />
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">''')

content = content.replace('''              <span className="text-[11px] font-bold text-slate-500">
                {votes.no} voto{votes.no !== 1 ? "s" : ""} • {noWidth}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">''', '''              <span className="text-[11px] font-bold text-slate-500">
                {votes.no} voto{votes.no !== 1 ? "s" : ""} • {noWidth}%
              </span>
            </div>
            <AvatarList userIds={votes.noUsers} participants={participants} />
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">''')

# 4. Pass participants to DateVoteCard where called
content = content.replace('''                    <DateVoteCard
                      key={date.id}
                      date={date}
                      votes={getDateVotes(paseo, date.id)}
                      userVote={getUserDateVote(paseo, date.id, currentUser.id)}
                      totalParticipants={paseo.participants.length}''', '''                    <DateVoteCard
                      key={date.id}
                      date={date}
                      votes={getDateVotes(paseo, date.id)}
                      userVote={getUserDateVote(paseo, date.id, currentUser.id)}
                      totalParticipants={paseo.participants.length}
                      participants={paseo.participants}''')

# 5. Update PlaceVoteCard Props
content = content.replace('''function PlaceVoteCard({
    place,
    votes,
    userVote,
    index,
    isWinner,
    isVotingLocked,
    onVote,
    onRemove,
  }) {''', '''function PlaceVoteCard({
    place,
    votes,
    userVote,
    index,
    isWinner,
    isVotingLocked,
    onVote,
    onRemove,
    participants,
  }) {''')

# 6. Update PlaceVoteCard Avatars
content = content.replace('''            <div className="flex items-center gap-1.5">
              <ThumbsUp size={13} className="text-green-500" />
              <span className="text-sm font-bold text-slate-700">
                {votes.likes}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThumbsDown size={13} className="text-red-400" />
              <span className="text-sm font-bold text-slate-700">
                {votes.dislikes}
              </span>
            </div>
            <span className="text-[10px] text-slate-300 flex-1 text-right">
              {totalVotes} voto{totalVotes !== 1 ? "s" : ""}
            </span>
          </div>
        </div>''', '''            <div className="flex items-center gap-1.5">
              <ThumbsUp size={13} className="text-green-500" />
              <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                {votes.likes}
                <AvatarList userIds={votes.likesUsers} participants={participants} />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThumbsDown size={13} className="text-red-400" />
              <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                {votes.dislikes}
                <AvatarList userIds={votes.dislikesUsers} participants={participants} />
              </span>
            </div>
            <span className="text-[10px] text-slate-300 flex-1 text-right">
              {totalVotes} voto{totalVotes !== 1 ? "s" : ""}
            </span>
          </div>
        </div>''')

# 7. Pass participants to PlaceVoteCard where called
content = content.replace('''                    <PlaceVoteCard
                      key={place.id}
                      place={place}
                      index={index}
                      votes={getPlaceVotes(paseo, place.id)}
                      userVote={getUserPlaceVote(paseo, place.id, currentUser.id)}
                      isWinner={isLocationLocked && index === 0}
                      isVotingLocked={isLocationLocked}
                      onVote={votePlace}
                      onRemove={removePlace}
                    />''', '''                    <PlaceVoteCard
                      key={place.id}
                      place={place}
                      index={index}
                      votes={getPlaceVotes(paseo, place.id)}
                      userVote={getUserPlaceVote(paseo, place.id, currentUser.id)}
                      isWinner={isLocationLocked && index === 0}
                      isVotingLocked={isLocationLocked}
                      onVote={votePlace}
                      onRemove={removePlace}
                      participants={paseo.participants}
                    />''')

with open('src/pages/Voting.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Voting patched")
