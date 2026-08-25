import re
file_path = 'src/pages/LaVaca.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add getTripDays and calcParticipantBaseCuota
math_funcs = '''
function getTripDays(paseo) {
  if (paseo?.isSameDay) return 1;
  const dates = paseo?.tentativeDates?.[0];
  if (dates?.startDate && dates?.endDate) {
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  }
  return 1;
}

function calcParticipantBaseCuota(paseo, participantId) {
  if (!paseo) return 0;
  
  const activeParticipants = paseo.participants?.filter(p => p.status !== "cancelled") || [];
  if (activeParticipants.length === 0) return 0;

  const maxDays = getTripDays(paseo);
  const ingredients = paseo.logistics?.ingredients || [];
  
  const liquorCost = ingredients
    .filter(i => i.category === "Bebidas")
    .reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
    
  const generalMarket = ingredients
    .filter(i => i.category !== "Bebidas")
    .reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
    
  const baseBudget = paseo.finance?.totalBudget || 0;
  const totalGeneral = baseBudget + generalMarket;

  let totalDaysAll = 0;
  let totalDrinkers = 0;

  activeParticipants.forEach(p => {
    const days = p.daysStayed ?? maxDays;
    const drinks = p.drinksAlcohol ?? true;
    totalDaysAll += days;
    if (drinks) totalDrinkers += 1;
  });

  const costPerDay = totalDaysAll > 0 ? totalGeneral / totalDaysAll : 0;
  const costPerDrinker = totalDrinkers > 0 ? liquorCost / totalDrinkers : 0;

  let myDays = maxDays;
  let myDrinks = true;

  if (participantId) {
    const me = activeParticipants.find(p => p.id === participantId);
    if (me) {
      myDays = me.daysStayed ?? maxDays;
      myDrinks = me.drinksAlcohol ?? true;
    }
  }

  const myBase = myDays * costPerDay;
  const myLiquor = myDrinks ? costPerDrinker : 0;
  
  return myBase + myLiquor;
}

function calcBaseCuota(paseo) {
  return calcParticipantBaseCuota(paseo, null); // Legacy wrapper / default max cuota
}
'''

content = re.sub(
    r'function calcBaseCuota\(paseo\) \{.*?return active === 0 \? 0 : calcAdjustedTotalBudget\(paseo\) / active;\n\}',
    math_funcs,
    content,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated math functions")
