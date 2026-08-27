export function calculateDuration(startDate, endDate) {
  if (!startDate) return { days: 0, nights: 0 };
  if (!endDate) return { days: 1, nights: 0 };
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  start.setHours(0,0,0,0);
  end.setHours(0,0,0,0);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  if (diffDays <= 0) return { days: 1, nights: 0 };
  
  const nights = diffDays - 1;
  return { days: diffDays, nights };
}

export function formatDuration(duration) {
  if (!duration || duration.days === 0) return "Fechas por definir";
  if (duration.days === 1) return "1 Día / 0 Noches (Pasadía)";
  return duration.days + " Días / " + duration.nights + " Noche" + (duration.nights > 1 ? 's' : '');
}

export function generateMealSlots(startDate, durationDays) {
  const slots = [];
  
  if (!startDate || durationDays <= 1) {
    return [
      { id: "Desayuno", label: "Desayuno", emoji: "☕", bgLight: "bg-amber-50/50", border: "border-amber-100", text: "text-amber-700" },
      { id: "Almuerzo", label: "Almuerzo", emoji: "☀️", bgLight: "bg-orange-50/50", border: "border-orange-100", text: "text-orange-700" },
      { id: "Cena", label: "Cena", emoji: "🌙", bgLight: "bg-indigo-50/50", border: "border-indigo-100", text: "text-indigo-700" },
            { id: 'Mercado General', label: 'Mercado General', emoji: '🛒', bgLight: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-700' },
      { id: 'Snacks', label: 'Snacks', emoji: '🥨', bgLight: 'bg-yellow-50/50', border: 'border-yellow-100', text: 'text-yellow-700' },
      { id: 'Bebidas Alcohólicas', label: 'Bebidas Alcohólicas', emoji: '🍻', bgLight: 'bg-fuchsia-50/50', border: 'border-fuchsia-100', text: 'text-fuchsia-700' },
      { id: 'Bebidas No Alcohólicas', label: 'Bebidas No Alcohólicas', emoji: '🧃', bgLight: 'bg-cyan-50/50', border: 'border-cyan-100', text: 'text-cyan-700' }
    ];
  }
  
  const start = new Date(startDate);
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  for (let i = 0; i < durationDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const diaName = diasSemana[currentDate.getDay()];
    
    if (i > 0) {
      slots.push({ id: "dia" + (i+1) + "_desayuno", label: "Desayuno (" + diaName + ")", emoji: "☕", bgLight: "bg-amber-50/50", border: "border-amber-100", text: "text-amber-700" });
    }
    slots.push({ id: "dia" + (i+1) + "_almuerzo", label: "Almuerzo (" + diaName + ")", emoji: "☀️", bgLight: "bg-orange-50/50", border: "border-orange-100", text: "text-orange-700" });
    if (i < durationDays - 1) {
      slots.push({ id: "dia" + (i+1) + "_cena", label: "Cena (" + diaName + ")", emoji: "🌙", bgLight: "bg-indigo-50/50", border: "border-indigo-100", text: "text-indigo-700" });
    }
  }
  slots.push({ id: 'Mercado General', label: 'Mercado General', emoji: '🛒', bgLight: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-700' });
  slots.push({ id: 'Snacks', label: 'Snacks', emoji: '🥨', bgLight: 'bg-yellow-50/50', border: 'border-yellow-100', text: 'text-yellow-700' });
  slots.push({ id: 'Bebidas Alcohólicas', label: 'Bebidas Alcohólicas', emoji: '🍻', bgLight: 'bg-fuchsia-50/50', border: 'border-fuchsia-100', text: 'text-fuchsia-700' });
  slots.push({ id: 'Bebidas No Alcohólicas', label: 'Bebidas No Alcohólicas', emoji: '🧃', bgLight: 'bg-cyan-50/50', border: 'border-cyan-100', text: 'text-cyan-700' });

  
  return slots;
}