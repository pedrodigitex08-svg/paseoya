import re
file_path = 'src/pages/Logistics.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the first instance of IngredientCategoryCard in lines 1080-1106
# Wait, let's just replace both of them using regex.
replacement = '''
            <div className="space-y-2 mt-4">
              {paseo.logistics?.ingredients?.filter(i => i.category === "Snacks").map(item => (
                <IngredientCard
                  key={item.id}
                  item={item}
                  onToggle={() => toggleIngredientBought(item.id)}
                  onRemove={() => removeIngredient(item.id)}
                  onSetActualCost={(id, cost) => {
                     const upd = paseo.logistics.ingredients.map(i => i.id === id ? {...i, actualCost: cost} : i);
                     usePaseo.getState().updatePaseo(paseo.slug, { logistics: { ...paseo.logistics, ingredients: upd } });
                  }}
                  isLocked={isLocked}
                />
              ))}
              {!isLocked && (
                <button
                  onClick={() => setActiveCategoryForModal({ id: "Snacks", label: "Equipos y Posiciones", emoji: "👕", color: "from-emerald-500 to-green-500" })}
                  className="w-full flex items-center justify-center gap-1.5 py-3 mt-4 rounded-xl text-white font-bold text-xs transition-all active:scale-[0.98] shadow-sm bg-gradient-to-r from-emerald-500 to-green-500"
                >
                  <Plus size={16} />
                  Agregar Jugador / Ítem
                </button>
              )}
            </div>
'''

content = re.sub(
    r'<IngredientCategoryCard\s+title="Equipos y Posiciones"\s+icon=\{ShoppingBasket\}\s+category="Desayuno"\s+items=\{activePaseo\.logistics\?\.ingredients\?\.filter\(\s*\(i\) => i\.category === "Desayuno"\s*\)\s*\}\s+onAdd=\{handleAddIngredient\}\s+onRemove=\{removeIngredient\}\s+onToggle=\{toggleIngredientBought\}\s+isLocked=\{isLocked\}\s+placeholder="Ej: Pedro \(Arquero Equipo A\)"\s+/>',
    replacement,
    content
)

content = re.sub(
    r'<IngredientCategoryCard\s+title="Equipos y Posiciones"\s+icon=\{ShoppingBasket\}\s+category="Snacks"\s+items=\{paseo\.logistics\?\.ingredients\?\.filter\(\s*\(i\) => i\.category === "Snacks"\s*\)\s*\}\s+onAdd=\{handleAddIngredient\}\s+onRemove=\{removeIngredient\}\s+onToggle=\{toggleIngredientBought\}\s+isLocked=\{isLocked\}\s+placeholder="Ej: Pedro \(Arquero Equipo A\)"\s+/>',
    replacement,
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Logistics.jsx")
