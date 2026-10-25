"use client";

import { MeldcodeSearch } from "@/components/wizard/MeldcodeSearch";
import { SmartAddressInput } from "@/components/wizard/SmartAddressInput";
import { useState } from "react";
import {
    AddButton,
    CheckboxField,
    DateFields,
    InputField,
    NavigationButtons,
    RadioGroup,
    RemoveButton,
    SelectField,
} from "./components";
import { MEASURE_META, bedragVoorJaar, defaultAdres, isLuchtWater } from "./reducer";

const MELDCODE_TOOLTIP =
  "De meldcode staat op uw factuur van de installateur. Het is een code die begint met twee letters gevolgd door cijfers, bijv. KA17439.";

// ─── Shared date + aantal helpers ────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear();
const DATE_YEARS = [CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR];

function YearPicker({ label, required, helperText, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {DATE_YEARS.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => onChange(y)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              value === y
                ? "bg-secondary text-white border-secondary"
                : "bg-white text-gray-500 border-gray-300 hover:border-secondary hover:text-secondary"
            }`}
          >
            {y}
          </button>
        ))}
      </div>
      {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
}

// Koppelt MeldcodeSearch aan de wizard: bij selectie staan plaatsing en aanschaf op het huidige
// jaar, en het subsidiebedrag volgt het aanschafjaar.
function meldcodeHandlers({ maatregelType, products, detail, upd }) {
  const setBedrag = (meldcode, jaar) => {
    const { subsidiebedrag, bedrag_onbekend } = bedragVoorJaar(products, maatregelType, meldcode, jaar);
    upd(["subsidiebedrag"], subsidiebedrag);
    upd(["bedrag_onbekend"], bedrag_onbekend);
  };

  return {
    onSelect: (product) => {
      if (product) {
        upd(["selectedProduct"], product);
        upd(["meldcode"], product.meldcode);
        upd(["jaar_plaatsing"], CURRENT_YEAR);
        upd(["jaar_aanschaf"], CURRENT_YEAR);
        setBedrag(product.meldcode, CURRENT_YEAR);
      } else {
        upd(["selectedProduct"], null);
        upd(["meldcode"], "");
        upd(["subsidiebedrag"], null);
        upd(["bedrag_onbekend"], false);
      }
    },
    onChange: (updates) => {
      Object.entries(updates).forEach(([k, v]) => upd([k], v));
      if (updates.jaar_aanschaf && detail.selectedProduct) {
        setBedrag(detail.selectedProduct.meldcode, updates.jaar_aanschaf);
      }
    },
  };
}

// ─── Adres van de woning: verplicht per maatregel ─────────────────────────────
export function adresFout(adres, omschrijving = "het volledige adres van de woning") {
  const leeg = ["postcode", "huisnummer", "straat", "plaats"].some((k) => !(adres?.[k] ?? "").toString().trim());
  if (leeg) return `Vul ${omschrijving} in.`;
  if (!/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(adres.postcode.trim())) return "Voer een geldige postcode in, bijv. 1234 AB.";
  return null;
}

// ─── Zakelijk: ISDE vooraf aanvragen ─────────────────────────────────────────
// Een ondernemer moet aanvragen vóórdat hij opdracht geeft; achteraf keurt RVO af.
export function opdrachtFout(detail) {
  if (!detail?.opdracht_gegeven) return "Beantwoord deze vraag.";
  if (detail.opdracht_gegeven === "ja") return "Al opdracht gegeven: ISDE is dan niet meer mogelijk.";
  return null;
}

function OpdrachtVraag({ detail, upd, showErrors }) {
  return (
    <div>
      <RadioGroup
        label="Heeft u het installatiebedrijf al opdracht gegeven of de offerte getekend?"
        required
        value={detail.opdracht_gegeven}
        onChange={(v) => upd(["opdracht_gegeven"], v)}
        options={[{ value: "nee", label: "Nee, nog niet" }, { value: "ja", label: "Ja" }]}
        error={showErrors && !detail.opdracht_gegeven ? "Beantwoord deze vraag." : null}
      />
      {detail.opdracht_gegeven === "ja" && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Als ondernemer moet u ISDE aanvragen vóórdat u opdracht geeft. Een aanvraag achteraf wijst RVO af, dus
          voor deze maatregel kunt u geen ISDE meer krijgen.{" "}
          <a href="/contact" className="underline font-medium">Neem contact op</a> als u twijfelt.
        </div>
      )}
    </div>
  );
}

// ─── Zakelijk: adres van uitvoering, optioneel meerdere ───────────────────────
function UitvoeringsAdressen({ id, detail, dispatch, showErrors }) {
  const woningen = detail.woningen ?? [];
  const meerdere = !!detail.meerdere_adressen;

  const setMeerdere = (aan) => {
    dispatch({ type: "UPDATE_DETAIL", payload: { id, path: ["meerdere_adressen"], value: aan } });
    // Uit: alleen het eerste adres blijft over
    if (!aan && woningen.length > 1) {
      dispatch({ type: "UPDATE_DETAIL", payload: { id, path: ["woningen"], value: [woningen[0]] } });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-700">
          Adres van uitvoering <span className="text-red-500">*</span>
        </p>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-sm text-gray-600">Meerdere adressen</span>
          <button
            type="button"
            role="switch"
            aria-checked={meerdere}
            onClick={() => setMeerdere(!meerdere)}
            className={`relative w-10 h-6 rounded-full transition ${meerdere ? "bg-secondary" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${meerdere ? "translate-x-4" : ""}`}
            />
          </button>
        </label>
      </div>

      {woningen.map((adres, i) => (
        <div key={i} className="space-y-3">
          {woningen.length > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Adres #{i + 1}</p>
              {i > 0 && (
                <RemoveButton
                  onClick={() =>
                    dispatch({ type: "REMOVE_SUB_ITEM", payload: { id, listKey: "woningen", index: i } })
                  }
                />
              )}
            </div>
          )}
          <SmartAddressInput
            label={null}
            required
            error={showErrors ? adresFout(adres, "het volledige adres van uitvoering") : null}
            value={adres}
            onChange={(v) =>
              dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "woningen", index: i, field: null, value: v } })
            }
          />
        </div>
      ))}
      {meerdere && (
        <AddButton
          label="Nog een adres toevoegen"
          onClick={() =>
            dispatch({ type: "ADD_SUB_ITEM", payload: { id, listKey: "woningen", template: defaultAdres() } })
          }
        />
      )}
    </div>
  );
}

const AANTAL_PILLS = [1, 2, 3, 4];

function AantalPills({ label, value, onChange }) {
  const isCustom = (value ?? 1) > 4;
  const selected = isCustom ? "5+" : (value ?? 1);

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {AANTAL_PILLS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              selected === n
                ? "bg-secondary text-white border-secondary"
                : "bg-white text-gray-500 border-gray-300 hover:border-secondary hover:text-secondary"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(isCustom ? value : 5)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
            isCustom
              ? "bg-secondary text-white border-secondary"
              : "bg-white text-gray-500 border-gray-300 hover:border-secondary hover:text-secondary"
          }`}
        >
          5+
        </button>
        {isCustom && (
          <div className="flex items-center gap-2 ml-1">
            <span className="text-sm text-gray-600">Aantal:</span>
            <input
              type="number"
              min={5}
              value={value}
              onChange={(e) => onChange(Math.max(5, Number(e.target.value)))}
              className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Warmtepomp detail card ───────────────────────────────────────────────────
function WarmtepompCard({ id, detail, dispatch, index, total, sectionLabel, products, productsLoading, isIsde, zakelijk, showErrors }) {
  const upd = (path, value) =>
    dispatch({ type: "UPDATE_DETAIL", payload: { id, path, value } });
  const updSub = (listKey, idx, field, value) =>
    dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey, index: idx, field, value } });
  const handlers = meldcodeHandlers({ maatregelType: "warmtepomp", products: products ?? [], detail, upd });

  // Zakelijk: the aardgas question only applies once a non lucht-water warmtepomp is chosen
  const toonAardgas = !zakelijk || (detail.selectedProduct && !isLuchtWater(detail));
  const onSelect = (product) => {
    handlers.onSelect(product);
    if (zakelijk && product?.categorie === "Lucht-Water") upd(["nog_aardgas"], "");
    // No longer lucht-water: an uploaded jaarnota should not be sent along
    if (zakelijk && product?.categorie !== "Lucht-Water") {
      dispatch({ type: "CLEAR_DOC_CATEGORY", payload: { measureId: id, category: "jaarnota" } });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-fire-flame-curved text-secondary" />
          <span className="font-bold text-primary">
            {sectionLabel ?? `Warmtepomp${total > 1 ? ` #${index + 1}` : ""}`}
          </span>
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">
        {zakelijk && <OpdrachtVraag detail={detail} upd={upd} showErrors={showErrors} />}

        <MeldcodeSearch
          maatregelType="warmtepomp"
          products={products ?? []}
          productsLoading={productsLoading}
          detail={detail}
          {...handlers}
          onSelect={onSelect}
          toonJaren={!zakelijk}
        />

        {toonAardgas && (
          <RadioGroup
            label="Gebruikt u na de installatie van deze warmtepomp nog aardgas voor ruimteverwarming?"
            required
            value={detail.nog_aardgas}
            onChange={(v) => upd(["nog_aardgas"], v)}
            options={[{ value: "ja", label: "Ja" }, { value: "nee", label: "Nee" }]}
          />
        )}

        {zakelijk ? (
          <UitvoeringsAdressen id={id} detail={detail} dispatch={dispatch} showErrors={showErrors} />
        ) : (
          <>
            {/* Woningen */}
            {(detail.woningen ?? []).map((adres, i) => (
              <div key={i} className="space-y-3">
                {(detail.woningen?.length ?? 1) > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Adres van de woning #{i + 1} <span className="text-red-500">*</span>
                    </p>
                    {i > 0 && (
                      <RemoveButton
                        onClick={() =>
                          dispatch({ type: "REMOVE_SUB_ITEM", payload: { id, listKey: "woningen", index: i } })
                        }
                      />
                    )}
                  </div>
                )}
                <SmartAddressInput
                  required
                  error={showErrors ? adresFout(adres) : null}
                  label={i === 0 && (detail.woningen?.length ?? 1) === 1 ? "Adres van de woning" : undefined}
                  value={adres}
                  onChange={(v) =>
                    dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "woningen", index: i, field: null, value: v } })
                  }
                />
              </div>
            ))}
            {!isIsde && (
              <AddButton
                label="Nog een woning toevoegen"
                onClick={() =>
                  dispatch({ type: "ADD_SUB_ITEM", payload: { id, listKey: "woningen", template: defaultAdres() } })
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Isolatie detail card ─────────────────────────────────────────────────
function IsolatieCard({ id, detail, dispatch, index, total, sectionLabel, products, productsLoading, isIsde, showErrors }) {
  const upd = (path, value) =>
    dispatch({ type: "UPDATE_DETAIL", payload: { id, path, value } });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center gap-2">
        <i className="fa-solid fa-house-chimney-window text-secondary" />
        <span className="font-bold text-primary">
          {sectionLabel ?? `Isolatie${total > 1 ? ` #${index + 1}` : ""}`}
        </span>
      </div>
      <div className="px-6 py-5 space-y-5">
        <SelectField
          label="Type isolatie"
          required
          value={detail.type_isolatie}
          onChange={(e) => upd(["type_isolatie"], e.target.value)}
        >
          <option value="">Selecteer type</option>
          {[
            "Dakisolatie","Gevelisolatie","Spouwmuurisolatie","Vloerisolatie",
            "Glasisolatie HR++","Zolder- of vlieringvloer","Bodemeisolatie","Combinatie",
          ].map((o) => <option key={o} value={o}>{o}</option>)}
        </SelectField>

        <DateFields
          label="Uitvoeringsdatum"
          required
          value={detail.uitvoeringsdatum}
          onChange={(v) => upd(["uitvoeringsdatum"], v)}
        />

        {/* Meldcodes */}
        {(detail.meldcodes ?? []).map((item, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Meldcode{(detail.meldcodes?.length ?? 1) > 1 ? ` #${i + 1}` : ""}
              </p>
              {i > 0 && (
                <RemoveButton
                  onClick={() =>
                    dispatch({ type: "REMOVE_SUB_ITEM", payload: { id, listKey: "meldcodes", index: i } })
                  }
                />
              )}
            </div>
            <MeldcodeSearch
              maatregelType="isolatie"
              products={products ?? []}
              productsLoading={productsLoading}
              detail={item}
              onSelect={(product) => {
                if (product) {
                  dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "meldcodes", index: i, field: "selectedProduct", value: product } });
                  dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "meldcodes", index: i, field: "meldcode", value: product.meldcode } });
                } else {
                  dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "meldcodes", index: i, field: "selectedProduct", value: null } });
                  dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "meldcodes", index: i, field: "meldcode", value: "" } });
                }
              }}
              onChange={(updates) => {
                Object.entries(updates).forEach(([k, v]) => {
                  dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "meldcodes", index: i, field: k, value: v } });
                });
              }}
            />
            <InputField
              label="Geïsoleerde oppervlakte (m²)"
              required
              type="number"
              value={item.oppervlakte}
              onChange={(e) =>
                dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "meldcodes", index: i, field: "oppervlakte", value: e.target.value } })
              }
              placeholder="bijv. 45"
            />
          </div>
        ))}
        <AddButton
          label="Nog een meldcode toevoegen"
          onClick={() =>
            dispatch({ type: "ADD_SUB_ITEM", payload: { id, listKey: "meldcodes", template: { meldcode: "", oppervlakte: "" } } })
          }
        />

        <CheckboxField
          label="Ik verklaar dat het opgegeven m² geen betrekking heeft op een nieuwe dakkapel, aanbouw of andere uitbreiding van mijn woning en voldoet aan de subsidievoorwaarden."
          checked={detail.verklaring_m2}
          onChange={(v) => upd(["verklaring_m2"], v)}
        />

        {/* Woningen — hidden for ISDE */}
        {(detail.woningen ?? []).map((adres, i) => (
          <div key={i} className="space-y-3">
            {(detail.woningen?.length ?? 1) > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  Adres van de woning #{i + 1} <span className="text-red-500">*</span>
                </p>
                {i > 0 && (
                  <RemoveButton
                    onClick={() =>
                      dispatch({ type: "REMOVE_SUB_ITEM", payload: { id, listKey: "woningen", index: i } })
                    }
                  />
                )}
              </div>
            )}
            <SmartAddressInput
              required
              error={showErrors ? adresFout(adres) : null}
              label={i === 0 && (detail.woningen?.length ?? 1) === 1 ? "Adres van de woning" : undefined}
              value={adres}
              onChange={(v) =>
                dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "woningen", index: i, field: null, value: v } })
              }
            />
          </div>
        ))}
        {!isIsde && (
          <AddButton
            label="Nog een woning toevoegen"
            onClick={() =>
              dispatch({ type: "ADD_SUB_ITEM", payload: { id, listKey: "woningen", template: defaultAdres() } })
            }
          />
        )}
      </div>
    </div>
  );
}

// ─── Zonneboiler detail card ──────────────────────────────────────────────────
function ZonneboilerCard({ id, detail, dispatch, index, total, sectionLabel, products, productsLoading, isIsde, zakelijk, showErrors }) {
  const upd = (path, value) =>
    dispatch({ type: "UPDATE_DETAIL", payload: { id, path, value } });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center gap-2">
        <i className="fa-solid fa-droplet text-secondary" />
        <span className="font-bold text-primary">
          {sectionLabel ?? `Zonneboiler${total > 1 ? ` #${index + 1}` : ""}`}
        </span>
      </div>
      <div className="px-6 py-5 space-y-5">
        {zakelijk && <OpdrachtVraag detail={detail} upd={upd} showErrors={showErrors} />}

        {/* Aantal */}
        <div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              {zakelijk ? "Aantal zonneboilers" : "Aantal zonneboilers in deze woning"}
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={detail.aantal ?? 1}
              onChange={(e) => upd(["aantal"], Math.max(1, Math.min(10, Number(e.target.value))))}
              className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          {(detail.aantal ?? 1) > 1 && (
            <p className="text-xs text-gray-400 mt-1">U vult voor elk apparaat dezelfde meldcode in, of voeg meerdere meldcodes toe via ‘+ Nog een meldcode toevoegen’</p>
          )}
        </div>

        <MeldcodeSearch
          maatregelType="zonneboiler"
          products={products ?? []}
          productsLoading={productsLoading}
          detail={detail}
          {...meldcodeHandlers({ maatregelType: "zonneboiler", products: products ?? [], detail, upd })}
          toonJaren={!zakelijk}
        />

        {zakelijk ? (
          <UitvoeringsAdressen id={id} detail={detail} dispatch={dispatch} showErrors={showErrors} />
        ) : (
          <>
            {(detail.woningen ?? []).map((adres, i) => (
              <div key={i} className="space-y-3">
                {(detail.woningen?.length ?? 1) > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Adres van de woning #{i + 1} <span className="text-red-500">*</span>
                    </p>
                    {i > 0 && (
                      <RemoveButton
                        onClick={() =>
                          dispatch({ type: "REMOVE_SUB_ITEM", payload: { id, listKey: "woningen", index: i } })
                        }
                      />
                    )}
                  </div>
                )}
                <SmartAddressInput
                  required
                  error={showErrors ? adresFout(adres) : null}
                  label={i === 0 && (detail.woningen?.length ?? 1) === 1 ? "Adres van de woning" : undefined}
                  value={adres}
                  onChange={(v) =>
                    dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "woningen", index: i, field: null, value: v } })
                  }
                />
              </div>
            ))}
            {!isIsde && (
              <AddButton
                label="Nog een woning toevoegen"
                onClick={() =>
                  dispatch({ type: "ADD_SUB_ITEM", payload: { id, listKey: "woningen", template: defaultAdres() } })
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Elektrisch detail card ───────────────────────────────────────────────────
function ElektrischCard({ id, detail, dispatch, index, total, sectionLabel, isIsde, showErrors }) {
  const upd = (path, value) =>
    dispatch({ type: "UPDATE_DETAIL", payload: { id, path, value } });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center gap-2">
        <i className="fa-solid fa-bolt text-secondary" />
        <span className="font-bold text-primary">
          {sectionLabel ?? `Elektrische kookvoorziening${total > 1 ? ` #${index + 1}` : ""}`}
        </span>
      </div>
      <div className="px-6 py-5 space-y-5">
        <DateFields
          label="Datum gasmeter weggehaald"
          required
          value={detail.datum_gasmeter}
          onChange={(v) => upd(["datum_gasmeter"], v)}
        />

        <CheckboxField
          label="Ik verklaar dat de aardgasmeter is verwijderd uit mijn woning."
          checked={detail.verklaring_gasmeter}
          onChange={(v) => upd(["verklaring_gasmeter"], v)}
        />

        <CheckboxField
          label="Ik verklaar dat de woning op een warmtedistributienet is aangesloten en kan dit aantonen."
          checked={detail.verklaring_warmtenet}
          onChange={(v) => upd(["verklaring_warmtenet"], v)}
        />

        <CheckboxField
          label="Ik verklaar dat ik niet eerder subsidie heb gehad van de rijksoverheid voor de aansluiting op een warmtenet."
          checked={detail.verklaring_geen_eerdere_subsidie}
          onChange={(v) => upd(["verklaring_geen_eerdere_subsidie"], v)}
        />

        <DateFields
          label="Aanschafdatum elektrische kookvoorziening"
          required
          value={detail.aanschafdatum_kookvoorziening}
          onChange={(v) => upd(["aanschafdatum_kookvoorziening"], v)}
        />

        <CheckboxField
          label="Ik verklaar dat de elektrische kookvoorziening nieuw en niet eerder gebruikt is."
          checked={detail.verklaring_nieuw}
          onChange={(v) => upd(["verklaring_nieuw"], v)}
        />

        {(detail.woningen ?? []).map((adres, i) => (
          <div key={i} className="space-y-3">
            {(detail.woningen?.length ?? 1) > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  Adres van de woning #{i + 1} <span className="text-red-500">*</span>
                </p>
                {i > 0 && (
                  <RemoveButton
                    onClick={() =>
                      dispatch({ type: "REMOVE_SUB_ITEM", payload: { id, listKey: "woningen", index: i } })
                    }
                  />
                )}
              </div>
            )}
            <SmartAddressInput
              required
              error={showErrors ? adresFout(adres) : null}
              label={i === 0 && (detail.woningen?.length ?? 1) === 1 ? "Adres van de woning" : undefined}
              value={adres}
              onChange={(v) =>
                dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "woningen", index: i, field: null, value: v } })
              }
            />
          </div>
        ))}
        {!isIsde && (
          <AddButton
            label="Nog een woning toevoegen"
            onClick={() =>
              dispatch({ type: "ADD_SUB_ITEM", payload: { id, listKey: "woningen", template: defaultAdres() } })
            }
          />
        )}
      </div>
    </div>
  );
}

// ─── Ventilatie detail card ───────────────────────────────────────────────────
function VentilatieCard({ id, detail, dispatch, index, total, sectionLabel, products, productsLoading, isIsde, showErrors }) {
  const upd = (path, value) =>
    dispatch({ type: "UPDATE_DETAIL", payload: { id, path, value } });

  const ventilatieProd = (products ?? []).filter((p) => p.maatregel_type === "ventilatie");

  const grouped = ventilatieProd.reduce((acc, p) => {
    const cat = p.categorie ?? "Overig";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center gap-2">
        <i className="fa-solid fa-wind text-secondary" />
        <span className="font-bold text-primary">
          {sectionLabel ?? `Ventilatiesysteem${total > 1 ? ` #${index + 1}` : ""}`}
        </span>
      </div>
      <div className="px-6 py-5 space-y-5">
        <SelectField
          label="Ventilatiesysteem (meldcode)"
          required
          value={detail.meldcode}
          onChange={(e) => upd(["meldcode"], e.target.value)}
        >
          <option value="">{productsLoading ? "Laden…" : "Selecteer een systeem"}</option>
          {Object.entries(grouped).map(([cat, items]) => (
            <optgroup key={cat} label={cat}>
              {items.map((p) => (
                <option key={p.id} value={p.meldcode}>{`${p.merk} – ${p.type} (${p.meldcode})`}</option>
              ))}
            </optgroup>
          ))}
        </SelectField>

        <DateFields
          label="Uitvoeringsdatum"
          required
          value={detail.uitvoeringsdatum}
          onChange={(v) => upd(["uitvoeringsdatum"], v)}
        />

        {(detail.woningen ?? []).map((adres, i) => (
          <div key={i} className="space-y-3">
            {(detail.woningen?.length ?? 1) > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  Adres van de woning #{i + 1} <span className="text-red-500">*</span>
                </p>
                {i > 0 && (
                  <RemoveButton
                    onClick={() =>
                      dispatch({ type: "REMOVE_SUB_ITEM", payload: { id, listKey: "woningen", index: i } })
                    }
                  />
                )}
              </div>
            )}
            <SmartAddressInput
              required
              error={showErrors ? adresFout(adres) : null}
              label={i === 0 && (detail.woningen?.length ?? 1) === 1 ? "Adres van de woning" : undefined}
              value={adres}
              onChange={(v) =>
                dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "woningen", index: i, field: null, value: v } })
              }
            />
          </div>
        ))}
        {!isIsde && (
          <AddButton
            label="Nog een woning toevoegen"
            onClick={() =>
              dispatch({ type: "ADD_SUB_ITEM", payload: { id, listKey: "woningen", template: defaultAdres() } })
            }
          />
        )}
      </div>
    </div>
  );
}

// ─── Warmtenet detail card ────────────────────────────────────────────────────
function WarmtenetCard({ id, detail, dispatch, index, total, sectionLabel, isIsde, showErrors }) {
  const upd = (path, value) =>
    dispatch({ type: "UPDATE_DETAIL", payload: { id, path, value } });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center gap-2">
        <i className="fa-solid fa-city text-secondary" />
        <span className="font-bold text-primary">
          {sectionLabel ?? `Aansluiting warmtenet${total > 1 ? ` #${index + 1}` : ""}`}
        </span>
      </div>
      <div className="px-6 py-5 space-y-5">
        <InputField
          label="Naam warmtebedrijf"
          required
          placeholder="Bijv. Vattenfall, Eneco"
          value={detail.warmtebedrijf ?? ""}
          onChange={(e) => upd(["warmtebedrijf"], e.target.value)}
        />

        <DateFields
          label="Datum aansluiting warmtenet"
          required
          value={detail.aansluitdatum}
          onChange={(v) => upd(["aansluitdatum"], v)}
        />

        <CheckboxField
          label="Ik verklaar dat ik niet eerder subsidie heb gehad van de rijksoverheid voor de aansluiting op een warmtenet."
          checked={detail.verklaring_geen_eerdere_subsidie}
          onChange={(v) => upd(["verklaring_geen_eerdere_subsidie"], v)}
        />

        {(detail.woningen ?? []).map((adres, i) => (
          <SmartAddressInput
              required
              error={showErrors ? adresFout(adres) : null}
            key={i}
            label="Adres van de woning"
            value={adres}
            onChange={(v) =>
              dispatch({ type: "UPDATE_SUB_ITEM", payload: { id, listKey: "woningen", index: i, field: null, value: v } })
            }
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step 2 wrapper ───────────────────────────────────────────────────────────
const CARD_MAP = {
  warmtepomp: WarmtepompCard,
  isolatie: IsolatieCard,
  zonneboiler: ZonneboilerCard,
  elektrisch: ElektrischCard,
  ventilatie: VentilatieCard,
  warmtenet: WarmtenetCard,
};

export default function Step2({ state, dispatch, products, productsLoading, regelingType }) {
  const { measures, details, woningen } = state;
  const isIsde = regelingType === "ISDE";
  const zakelijk = isIsde && state.doelgroep === "zakelijk";
  const [showErrors, setShowErrors] = useState(false);

  // Build a lookup: woningId → 1-based display index
  const woningIndexMap = Object.fromEntries(
    (woningen ?? []).map((w, i) => [w.id, i + 1])
  );

  // Count instances per type for label numbering (legacy multi-instance)
  const typeCounts = measures.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] ?? 0) + 1;
    return acc;
  }, {});

  // Track display index per type
  const typeIndex = {};

  const ontbrekendeAdressen = measures
    .filter((m) => (details[m.id]?.woningen ?? []).some((adres) => adresFout(adres)))
    .map((m) => {
      const woningNum = !isIsde && m.woningId != null ? woningIndexMap[m.woningId] : null;
      const label = MEASURE_META[m.type]?.label ?? m.type;
      return woningNum != null ? `Woning ${woningNum} — ${label}` : label;
    });

  const opdrachtFouten = zakelijk ? measures.filter((m) => opdrachtFout(details[m.id])) : [];

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-1">Details per maatregel</h2>
      <p className="text-gray-500 text-sm mb-6">
        Vul de gegevens in voor elke geselecteerde maatregel.
      </p>

      {zakelijk && (
        <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 px-5 py-4 flex items-start gap-3">
          <i className="fa-solid fa-triangle-exclamation text-yellow-500 mt-0.5" />
          <p className="text-sm text-gray-700">
            <strong>Let op:</strong> als ondernemer vraagt u ISDE aan <strong>vóórdat</strong> u het installatiebedrijf
            opdracht geeft of de offerte tekent. Wacht met de opdracht tot RVO uw aanvraag heeft goedgekeurd.
          </p>
        </div>
      )}

      {measures.map((m) => {
        typeIndex[m.type] = (typeIndex[m.type] ?? -1) + 1;
        const CardComponent = CARD_MAP[m.type];
        if (!CardComponent) return null;

        // For ISDE: no woning prefix. For SVOH: "Woning X — Maatregel"
        const woningNum = !isIsde && m.woningId != null ? woningIndexMap[m.woningId] : null;
        const sectionLabel = woningNum != null
          ? `Woning ${woningNum} — ${MEASURE_META[m.type]?.label ?? m.type}`
          : undefined;

        return (
          <CardComponent
            key={m.id}
            id={m.id}
            detail={details[m.id] ?? {}}
            dispatch={dispatch}
            index={typeIndex[m.type]}
            total={typeCounts[m.type]}
            sectionLabel={sectionLabel}
            products={products ?? []}
            productsLoading={productsLoading}
            isIsde={isIsde}
            zakelijk={zakelijk}
            showErrors={showErrors}
          />
        );
      })}

      {showErrors && ontbrekendeAdressen.length > 0 && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-red-600 font-medium text-sm mb-2">
            {zakelijk ? "Vul het adres van uitvoering in bij:" : "Vul het adres van de woning in bij:"}
          </p>
          <ul className="list-disc list-inside space-y-1">
            {ontbrekendeAdressen.map((label) => (
              <li key={label} className="text-red-500 text-sm">{label}</li>
            ))}
          </ul>
        </div>
      )}

      {showErrors && opdrachtFouten.length > 0 && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-red-600 font-medium text-sm mb-2">Controleer de opdrachtvraag bij:</p>
          <ul className="list-disc list-inside space-y-1">
            {opdrachtFouten.map((m) => (
              <li key={m.id} className="text-red-500 text-sm">
                {MEASURE_META[m.type]?.label ?? m.type}: {opdrachtFout(details[m.id])}
              </li>
            ))}
          </ul>
        </div>
      )}

      <NavigationButtons
        step={2}
        onPrev={() => dispatch({ type: "PREV_STEP" })}
        onNext={() => {
          if (ontbrekendeAdressen.length > 0 || opdrachtFouten.length > 0) { setShowErrors(true); return; }
          dispatch({ type: "NEXT_STEP" });
        }}
      />
    </div>
  );
}
