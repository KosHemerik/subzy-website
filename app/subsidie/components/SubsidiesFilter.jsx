"use client";

import Link from "next/link";
import { useState } from "react";

const tabs = ["Particulier", "Verhuurder", "VvE"];

const subsidyCards = {
  Particulier: [
    {
      icon: "fa-solid fa-fan",
      title: "Warmtepomp subsidie",
      badge: "Populair",
      slug: "warmtepomp",
      description: "Hybride of volledig elektrische warmtepomp. Type systeem en vermogen bepalen uw subsidiebedrag.",
      avgReturn: "Gem. €2.400 terug",
      from: "Vanaf €85",
    },
    {
      icon: "fa-solid fa-solar-panel",
      title: "Zonneboiler subsidie",
      badge: null,
      slug: "zonneboiler",
      description: "Een zonneboiler gebruikt zonne-energie om water te verwarmen. Subsidie bij installatie door erkend installateur.",
      avgReturn: "Gem. €900 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-utensils",
      title: "Elektrische kookvoorziening",
      badge: null,
      slug: "elektrisch",
      description: "Vervangt u gas door een elektrische kookvoorziening? Dan komt u mogelijk in aanmerking voor subsidie.",
      avgReturn: "Gem. €450 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-house-chimney-window",
      title: "Isolatie & glas",
      badge: null,
      slug: "isolatie",
      description: "Spouwmuur, vloer, dak, gevel of HR glas — subsidie per maatregel. Installatie via erkend installateur vereist.",
      avgReturn: "Gem. €1.200 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-wind",
      title: "Ventilatiesysteem",
      badge: null,
      slug: "ventilatie",
      description: "WTW of CO₂-gestuurd systeem voor betere luchtkwaliteit. Subsidie bij installatie door erkend installateur.",
      avgReturn: "Gem. €600 terug",
      from: "Vanaf €65",
    },
  ],

  Verhuurder: [
    {
      icon: "fa-solid fa-fan",
      title: "Warmtepomp subsidie",
      badge: "Populair",
      slug: "warmtepomp",
      description: "Hybride of volledig elektrische warmtepomp voor huurwoningen. Type systeem en vermogen bepalen uw subsidiebedrag.",
      avgReturn: "Gem. €2.800 terug",
      from: "Vanaf €85",
    },
    {
      icon: "fa-solid fa-solar-panel",
      title: "Zonneboiler subsidie",
      badge: null,
      slug: "zonneboiler",
      description: "Een zonneboiler gebruikt zonne-energie om water te verwarmen. Subsidie bij installatie door erkend installateur.",
      avgReturn: "Gem. €900 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-house-chimney-window",
      title: "Isolatie & glas",
      badge: null,
      slug: "isolatie",
      description: "Spouwmuur, vloer, dak, gevel of HR glas — subsidie per maatregel. Installatie via erkend installateur vereist.",
      avgReturn: "Gem. €1.200 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-wind",
      title: "Ventilatiesysteem",
      badge: null,
      slug: "ventilatie",
      description: "WTW of CO₂-gestuurd systeem voor betere luchtkwaliteit. Subsidie bij installatie door erkend installateur.",
      avgReturn: "Gem. €600 terug",
      from: "Vanaf €65",
    },
  ],
  VvE: [
    {
      icon: "fa-solid fa-fan",
      title: "Warmtepomp subsidie",
      badge: "Populair",
      slug: "warmtepomp",
      description: "Hybride of volledig elektrische warmtepomp voor VvE-panden. Type systeem en vermogen bepalen uw subsidiebedrag.",
      avgReturn: "Gem. €2.800 terug",
      from: "Vanaf €85",
    },
    {
      icon: "fa-solid fa-solar-panel",
      title: "Zonneboiler subsidie",
      badge: null,
      slug: "zonneboiler",
      description: "Een zonneboiler gebruikt zonne-energie om water te verwarmen. Subsidie bij installatie door erkend installateur.",
      avgReturn: "Gem. €900 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-house-chimney-window",
      title: "Isolatie & glas",
      badge: null,
      slug: "isolatie",
      description: "Spouwmuur, vloer, dak, gevel of HR glas — subsidie per maatregel. Installatie via erkend installateur vereist.",
      avgReturn: "Gem. €1.200 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-wind",
      title: "Ventilatiesysteem",
      badge: null,
      slug: "ventilatie",
      description: "WTW of CO₂-gestuurd systeem voor betere luchtkwaliteit. Subsidie bij installatie door erkend installateur.",
      avgReturn: "Gem. €600 terug",
      from: "Vanaf €65",
    },
  ],
};

const TAB_SLUG = {
  Particulier: "particulier",
  Verhuurder: "verhuurder",
  VvE: "vve",
};

function SubsidyCard({ card, activeTab }) {
  return (
    <div className="relative bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col h-full">
      {/* Badge — absolute top-right */}
      {card.badge && (
        <span className="absolute top-4 right-4 bg-[#1a2e6b] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {card.badge}
        </span>
      )}

      {/* Icon above title */}
      <div className="w-10 h-10 bg-[#E6F1FB] rounded-xl flex items-center justify-center text-[#185FA5] text-base mb-4 flex-shrink-0">
        <i className={card.icon} />
      </div>

      <h3 className="text-base font-bold text-primary mb-2 pr-16">{card.title}</h3>
      <p className="text-gray-500 mb-5 text-[13px] leading-[1.6] flex-grow">{card.description}</p>

      {/* Financial info — stacked vertically */}
      <div className="border-t border-gray-100 pt-4 mb-4 flex flex-col gap-0.5">
        <span className="font-bold text-primary text-[15px]">{card.avgReturn}</span>
        <span className="text-gray-400 text-[12px]">{card.from}</span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={
            activeTab === "Particulier"
              ? `/subsidie/aanvragen/isde?maatregel=${card.slug}&doelgroep=${TAB_SLUG[activeTab]}`
              : `/subsidie/aanvragen/svoh?maatregel=${card.slug}&doelgroep=${TAB_SLUG[activeTab]}`
          }
          className="h-12 flex items-center justify-center bg-[#F5C518] hover:bg-[#e0b310] text-[#1a2e6b] font-semibold rounded-xl transition duration-200 text-sm text-center"
        >
          Direct regelen
        </Link>
        <Link
          href={activeTab === "Particulier" ? "/subsidie/isde" : "/subsidie/svoh"}
          className="h-12 flex items-center justify-center bg-white text-[#185FA5] hover:bg-[#E6F1FB] font-medium rounded-xl transition duration-200 text-sm text-center border border-[#E6F1FB]"
          style={{ borderWidth: "1px" }}
        >
          Meer info →
        </Link>
      </div>
    </div>
  );
}

export default function SubsidiesFilter() {
  const [activeTab, setActiveTab] = useState("Particulier");
  const cards = subsidyCards[activeTab] || [];

  return (
    <section id="subsidies" className="py-16 md:py-20 lg:py-24 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-background rounded-full p-1.5 shadow-sm border border-blue-50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-full text-sm transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#1a2e6c] text-white font-semibold shadow-sm"
                    : "bg-gray-100 text-gray-500 font-normal hover:bg-gray-200 hover:text-[#1a2e6c]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <SubsidyCard key={index} card={card} activeTab={activeTab} />
          ))}
        </div>
      </div>
    </section>
  );
}
