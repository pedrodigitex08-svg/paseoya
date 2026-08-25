import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the inner math inside ParticipantPayRow
old_math = '''  const baseBudget = paseo.finance?.totalBudget || 0;
  const ingredients = paseo.logistics?.ingredients || [];
  const marketReal = ingredients.reduce(
    (sum, item) => sum + (item.actualCost || item.estimatedCost || 0),
    0
  );
  const myBaseBudget = activeCount > 0 ? baseBudget / activeCount : 0;
  const myMarket = activeCount > 0 ? marketReal / activeCount : 0;'''

new_math = '''  const baseBudget = paseo.finance?.totalBudget || 0;
  const ingredients = paseo.logistics?.ingredients || [];
  
  const liquorCost = ingredients.filter(i => i.category === "Bebidas").reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
  const generalMarket = ingredients.filter(i => i.category !== "Bebidas").reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
  const totalGeneral = baseBudget + generalMarket;

  const maxDays = getTripDays(paseo);
  const activeParticipants = paseo.participants?.filter(p => p.status !== "cancelled") || [];
  
  let totalDaysAll = 0;
  let totalDrinkers = 0;
  activeParticipants.forEach(p => {
    totalDaysAll += (p.daysStayed ?? maxDays);
    if (p.drinksAlcohol !== false) totalDrinkers += 1;
  });

  const costPerDay = totalDaysAll > 0 ? totalGeneral / totalDaysAll : 0;
  const costPerDrinker = totalDrinkers > 0 ? liquorCost / totalDrinkers : 0;

  const myDays = participant.daysStayed ?? maxDays;
  const myDrinks = participant.drinksAlcohol ?? true;

  const myBaseBudget = (myDays * costPerDay) * (baseBudget / (totalGeneral || 1));
  const myMarket = (myDays * costPerDay) * (generalMarket / (totalGeneral || 1)) + (myDrinks ? costPerDrinker : 0);
'''
content = content.replace(old_math, new_math)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated inner math of ParticipantPayRow")
