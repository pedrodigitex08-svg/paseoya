import sys

with open('src/pages/LaVaca.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

vars_to_add = '''
  const baseBudget = paseo.finance?.totalBudget || 0;
  const ingredients = paseo.logistics?.ingredients || [];
  const marketReal = ingredients.reduce(
    (sum, item) => sum + (item.actualCost || item.estimatedCost || 0),
    0
  );
  const myBaseBudget = activeCount > 0 ? baseBudget / activeCount : 0;
  const myMarket = activeCount > 0 ? marketReal / activeCount : 0;
'''

ui_to_replace = '''      {expanded && isActive && (
        <div className="px-3 pb-3">
          <div
            className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
            style={{
              background: "#ffffff",
              backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          >
            {/* Cabecera de la factura */}
            <div className="px-4 py-3 border-b-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Receipt size={14} className="text-slate-500" />
                <p className="text-[11px] font-extrabold text-slate-700 uppercase tracking-widest">
                  Factura Desglose
                </p>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {new Date().toLocaleDateString("es-CO")}
              </p>
            </div>

            <div className="p-4 space-y-3 font-mono text-sm">
              
              {/* Item: Alojamiento / Base */}
              <div className="flex items-start justify-between gap-2 text-slate-600">
                <div>
                  <p className="font-bold text-slate-700">🏡 Alojamiento & Base</p>
                  <p className="text-[10px] text-slate-400">
                    {formatCOP(baseBudget)} / {activeCount} pers.
                  </p>
                </div>
                <span className="font-bold flex-shrink-0 text-slate-700">
                  {formatCOP(myBaseBudget)}
                </span>
              </div>

              {/* Item: Mercado (si hay) */}
              {marketReal > 0 && (
                <div className="flex items-start justify-between gap-2 text-slate-600">
                  <div>
                    <p className="font-bold text-slate-700">🍖 Comida y Mercado</p>
                    <p className="text-[10px] text-slate-400">
                      {formatCOP(marketReal)} / {activeCount} pers.
                    </p>
                  </div>
                  <span className="font-bold flex-shrink-0 text-slate-700">
                    {formatCOP(myMarket)}
                  </span>
                </div>
              )}

              {/* Item: Transporte Individual (si hay) */}
              {hasBusAddon && (
                <div className="flex items-start justify-between gap-2 text-teal-700">
                  <div>
                    <p className="font-bold">🚌 Transporte (Cupo)</p>
                    <p className="text-[10px] text-teal-600/70">
                      {bus.vendor ? `${bus.vendor} • ` : ""}
                      {formatCOP(bus.totalCost)} / {bus.assignedParticipants.length} asign.
                    </p>
                  </div>
                  <span className="font-bold flex-shrink-0">
                    +{formatCOP(busAddon)}
                  </span>
                </div>
              )}

              {/* Divider Total */}
              <div className="pt-3 border-t-2 border-dashed border-slate-300 mt-2 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-slate-800 uppercase tracking-widest text-xs">
                    Total a Pagar
                  </p>
                </div>
                <span className="text-xl font-extrabold" style={{ color: "#F97316" }}>
                  {formatCOP(totalCuota)}
                </span>
              </div>
            </div>
            
            {/* Pie de factura de adorno */}
            <div className="h-2 w-full" style={{
              backgroundImage: "radial-gradient(circle, transparent, transparent 4px, #ffffff 4px, #ffffff 10px, transparent 10px)",
              backgroundSize: "20px 10px",
              backgroundPosition: "bottom",
              backgroundRepeat: "repeat-x",
              marginBottom: "-2px"
            }} />
          </div>

          <div
            className={`mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold ${
              participant.hasPaid
                ? "bg-green-100 text-green-700"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            {participant.hasPaid ? (
              <>
                <CheckCircle2 size={13} /> ¡Cuota pagada! Gracias {participant.name.split(" ")[0]} 🎉
              </>
            ) : (
              <>
                <Circle size={13} /> Pago pendiente de {formatCOP(totalCuota)}
              </>
            )}
          </div>
        </div>
      )}
'''

# Start and end lines for the UI replacement block
ui_start = 914 # 0-indexed for 915
ui_end = 1007 # 0-indexed for 1008

# Verify lines
assert "{expanded && isActive && (" in lines[ui_start]
assert "      )}" in lines[ui_end]

# Replace UI block
lines[ui_start:ui_end+1] = [ui_to_replace]

# Insert variables after line 794 (0-indexed 793)
var_insert = 794
assert "const { bus }" in lines[var_insert - 1]
lines.insert(var_insert, vars_to_add)

with open('src/pages/LaVaca.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Patch applied successfully.")
