"use client";

import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useReducer, useRef, useState } from "react";
import { ProgressBar, StickyPriceBar } from "./components";
import { initialState, MEASURE_RANGES, reducer } from "./reducer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

const VALID_TYPES = ["warmtepomp", "isolatie", "zonneboiler", "elektrisch", "ventilatie"];

export default function SvohWizard({ regelingType = "SVOH", doelgroepProp }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const searchParams = useSearchParams();
  const preselected = useRef(false);

  const isIsde = regelingType === "ISDE";

  // Load all products once on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        // Helper: fetch all rows with pagination (Supabase default limit = 1000)
        async function fetchAll(table, select, filters = {}) {
          const PAGE = 1000;
          let from = 0;
          let all = [];
          while (true) {
            let q = supabase.from(table).select(select).range(from, from + PAGE - 1);
            for (const [col, val] of Object.entries(filters)) q = q.eq(col, val);
            const { data, error } = await q;
            if (error) { console.error(`${table} fetch error:`, error); break; }
            all = [...all, ...(data ?? [])];
            if (!data || data.length < PAGE) break;
            from += PAGE;
          }
          return all;
        }

        // Fetch all warmtepompen
        const warmtepompen = await fetchAll(
          "meldcodes_warmtepompen",
          "id, fabrikant, model, meldcode, subsidiebedrag, categorie"
        );

        const mappedWarmtepompen = warmtepompen.map((p) => ({
          id: p.id,
          maatregel_type: "warmtepomp",
          merk: p.fabrikant,
          type: p.model,
          meldcode: p.meldcode,
          subsidiebedrag: p.subsidiebedrag ?? 0,
          categorie: p.categorie ?? null,
          popularity: 0,
        }));

        // Fetch all zonneboilers
        const zonneboilers = await fetchAll(
          "meldcodes_zonneboilers",
          "id, fabrikant, model, meldcode, subsidiebedrag, oppervlakte"
        );

        const mappedZonneboilers = zonneboilers.map((p) => ({
          id: p.id,
          maatregel_type: "zonneboiler",
          merk: p.fabrikant,
          type: p.model,
          meldcode: p.meldcode,
          subsidiebedrag: p.subsidiebedrag ?? 0,
          categorie: p.oppervlakte ?? null,
          popularity: 0,
        }));

        // Fetch all ventilatie
        const ventilatie = await fetchAll(
          "meldcodes_ventilatie",
          "id, fabrikant, model, meldcode, subsidiebedrag, categorie"
        );

        const mappedVentilatie = ventilatie.map((p) => ({
          id: p.id,
          maatregel_type: "ventilatie",
          merk: p.fabrikant,
          type: p.model,
          meldcode: p.meldcode,
          subsidiebedrag: p.subsidiebedrag ?? 0,
          categorie: p.categorie ?? null,
          popularity: 0,
        }));

        const all = [...mappedWarmtepompen, ...mappedZonneboilers, ...mappedVentilatie];
        console.log(`[SvohWizard] loaded ${all.length} products (${mappedWarmtepompen.length} warmtepompen, ${mappedZonneboilers.length} zonneboilers, ${mappedVentilatie.length} ventilatie)`);
        setProducts(all);
      } catch (err) {
        console.error("[SvohWizard] loadProducts failed:", err);
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    if (preselected.current) return;
    const maatregel = searchParams.get("maatregel");
    const doelgroepParam = searchParams.get("doelgroep");
    const doelgroep = doelgroepProp ?? doelgroepParam;

    if (maatregel && VALID_TYPES.includes(maatregel)) {
      if (isIsde) {
        dispatch({ type: "TOGGLE_ISDE_MAATREGEL", payload: { type: maatregel } });
      } else {
        dispatch({ type: "TOGGLE_WONING_MAATREGEL", payload: { woningId: 1, type: maatregel } });
      }
    }
    if (!isIsde && (doelgroep === "verhuurder" || doelgroep === "vve")) {
      dispatch({ type: "SET_AANVRAGER_TYPE", payload: "bedrijf" });
    }
    if (isIsde) {
      dispatch({ type: "SET_AANVRAGER_TYPE", payload: "particulier" });
    }
    if (maatregel || doelgroep) preselected.current = true;
  }, [searchParams, isIsde, doelgroepProp]);

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div
        className="bg-white rounded-3xl p-8"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
      >
        {!state.submitted && <ProgressBar currentStep={state.step} />}
        {!state.submitted && state.measures.length > 0 && (
          <StickyPriceBar measures={state.measures} ranges={MEASURE_RANGES} details={state.details} />
        )}

        {state.step === 1 && <Step1 state={state} dispatch={dispatch} regelingType={regelingType} />}
        {state.step === 2 && <Step2 state={state} dispatch={dispatch} products={products} productsLoading={productsLoading} regelingType={regelingType} />}
        {state.step === 3 && <Step3 state={state} dispatch={dispatch} regelingType={regelingType} />}
        {state.step === 4 && <Step4 state={state} dispatch={dispatch} />}
        {state.step === 5 && <Step5 state={state} dispatch={dispatch} regelingType={regelingType} doelgroep={doelgroepProp ?? "particulier"} />}
      </div>
    </div>
  );
}
