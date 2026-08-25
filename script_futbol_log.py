import re

file_path = 'src/pages/Logistics.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'const isFutbol = activePaseo?.category === "futbol";' not in content:
    # 1. Define category booleans
    content = re.sub(
        r'const \[activeTab, setActiveTab\] = useState\("menu"\);',
        r'const isFutbol = activePaseo?.category === "futbol";\n  const isAsado = activePaseo?.category === "asado";\n  const [activeTab, setActiveTab] = useState(isFutbol ? "alineacion" : "menu");',
        content
    )

    # 2. Modify Tabs Array
    tabs_replacement = '''{[
            isFutbol 
              ? { id: "alineacion", label: "⚽ Alineación" } 
              : { id: "menu", label: "🛒 " + (isAsado ? "Carnes y Bebidas" : "Menú y Bebidas") },
            (!isFutbol) && { id: "transporte", label: "🚐 Transporte" },
          ].filter(Boolean).map((tab) => ('''
    
    content = re.sub(
        r'\{\[\n\s*\{ id: "menu", label: "🛒 Menú y Bebidas" \},\n\s*\{ id: "transporte", label: "🚐 Transporte" \},\n\s*\]\.map\(\(tab\) => \(',
        tabs_replacement,
        content
    )

    # 3. Add Alineacion Tab content
    alineacion_content = '''{activeTab === "alineacion" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4 mb-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👕</span>
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-emerald-800">
                    Alineación y Posiciones
                  </h2>
                  <p className="text-xs text-emerald-600/80 leading-relaxed">
                    Anota aquí los equipos, quién tapa, o usa esta lista para el alquiler de la cancha.
                  </p>
                </div>
              </div>
            </div>
            
            <IngredientCategoryCard
              title="Equipos y Posiciones"
              icon={ShoppingBasket} 
              category="Desayuno" 
              items={activePaseo.logistics?.ingredients?.filter(
                (i) => i.category === "Desayuno"
              )}
              onAdd={handleAddIngredient}
              onRemove={removeIngredient}
              onToggle={toggleIngredientBought}
              isLocked={isLocked}
              placeholder="Ej: Pedro (Arquero Equipo A)"
            />
          </div>
        )}

        {activeTab === "menu" && ('''
    content = re.sub(r'\{activeTab === "menu" && \(', alineacion_content, content)

    # 4. Modify Menu instruction text
    content = re.sub(
        r'Añade los ingredientes, bebidas o antojos en su respectiva',
        r'{isAsado ? "Anota las carnes, picadas, y quién lleva el carbón." : "Añade los ingredientes, bebidas o antojos en su respectiva"}',
        content
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Logistics.jsx for Futbol and Asado")
