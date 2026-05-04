"use client";

import Link from "next/link";
import { useState } from "react";

const tabs = ["Particulier", "Zakelijk", "Verhuurder", "VvE"];

const subsidyCards = {
  Particulier: [
    {
      icon: "fa-solid fa-house-chimney-window",
      title: "Isolatie subsidie",
      badge: "Populair",
      description:
        "Spouwmuur, vloer, dak of gevel isoleren. Beschikbaar voor eigenaar-bewoners die isoleren via een erkend installateur.",
      avgReturn: "Gem. €1.200 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-fan",
      title: "Warmtepomp subsidie",
      badge: null,
      description:
        "Hybride of volledig elektrische warmtepomp. De meest aangevraagde subsidie bij ons, waarbij het type systeem en het vermogen bepalen hoeveel u terugkrijgt.",
      avgReturn: "Gem. €2.400 terug",
      from: "Vanaf €85",
    },
    {
      icon: "fa-solid fa-border-all",
      title: "Glas & kozijnen",
      badge: null,
      description:
        "HR glas, of kozijnen. U ontvangt subsidie per geplaatste vierkante meter, mits de factuur aan de juiste eisen voldoet.",
      avgReturn: "Gem. €1.500 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-utensils",
      title: "Elektrische kookvoorziening",
      badge: null,
      description:
        "Vervangt u uw gasaansluiting door een elektrische kookvoorziening? Dan komt u mogelijk in aanmerking voor subsidie. Wij regelen de aanvraag volledig voor u.",
      avgReturn: "Gem. €450 terug",
      from: "Vanaf €65",
    },
  ],
  Zakelijk: [
    {
      icon: "fa-solid fa-building",
      title: "Zakelijke isolatie",
      badge: null,
      description:
        "Subsidie voor bedrijfspanden die isolatiemaatregelen nemen via erkende installateurs.",
      avgReturn: "Gem. €2.500 terug",
      from: "Vanaf €95",
    },
    {
      icon: "fa-solid fa-industry",
      title: "Zakelijke warmtepomp",
      badge: "Populair",
      description:
        "Warmtepompen voor zakelijk gebruik. Hoge subsidiebedragen beschikbaar afhankelijk van vermogen.",
      avgReturn: "Gem. €4.000 terug",
      from: "Vanaf €95",
    },
  ],
  Verhuurder: [
    {
      icon: "fa-solid fa-key",
      title: "Verhuurder isolatie",
      badge: null,
      description:
        "Als verhuurder kunt u subsidie aanvragen voor isolatiemaatregelen in uw huurpanden.",
      avgReturn: "Gem. €1.400 terug",
      from: "Vanaf €75",
    },
    {
      icon: "fa-solid fa-house-circle-check",
      title: "Verhuurder warmtepomp",
      badge: "Populair",
      description:
        "Subsidie voor warmtepompen in huurwoningen. Uw huurders profiteren van lagere energiekosten.",
      avgReturn: "Gem. €2.800 terug",
      from: "Vanaf €85",
    },
    {
      icon: "fa-solid fa-house-chimney-window",
      title: "Isolatie subsidie",
      badge: null,
      description:
        "Spouwmuur, vloer, dak of gevel isoleren. Beschikbaar voor verhuurders die isoleren via een erkend installateur.",
      avgReturn: "Gem. €1.200 terug",
      from: "Vanaf €65",
    },
    {
      icon: "fa-solid fa-fan",
      title: "Warmtepomp subsidie",
      badge: null,
      description:
        "Hybride of volledig elektrische warmtepomp. Het type systeem en het vermogen bepalen hoeveel u terugkrijgt.",
      avgReturn: "Gem. €2.400 terug",
      from: "Vanaf €85",
    },
    {
      icon: "fa-solid fa-border-all",
      title: "Glas & kozijnen",
      badge: null,
      description:
        "HR glas, of kozijnen. U ontvangt subsidie per geplaatste vierkante meter, mits de factuur aan de juiste eisen voldoet.",
      avgReturn: "Gem. €1.500 terug",
      from: "Vanaf €65",
    },
  ],
  VvE: [
    {
      icon: "fa-solid fa-building-columns",
      title: "VvE isolatie",
      badge: "Populair",
      description:
        "Verenigingen van eigenaren kunnen gezamenlijk subsidie aanvragen voor isolatiemaatregelen in het pand.",
      avgReturn: "Gem. €3.000 terug",
      from: "Vanaf €85",
    },
    {
      icon: "fa-solid fa-solar-panel",
      title: "VvE zonneboiler",
      badge: null,
      description:
        "Collectieve zonneboilerinstallaties voor VvE's. Profiteer van extra subsidie bij gecombineerde maatregelen.",
      avgReturn: "Gem. €1.800 terug",
      from: "Vanaf €75",
    },
  ],
};

function SubsidyCard({ card }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300 relative flex flex-col h-full">
      {card.badge && (
        <div className="absolute top-6 right-6 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {card.badge}
        </div>
      )}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-secondary text-xl">
          <i className={card.icon} />
        </div>
        <h3 className="text-xl font-bold text-primary">{card.title}</h3>
      </div>
      <p className="text-gray-600 mb-8 leading-relaxed flex-grow">{card.description}</p>
      <div className="border-t border-gray-100 pt-6 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-bold text-primary text-lg">{card.avgReturn}</span>
          <span className="bg-gray-50 text-gray-600 text-sm px-3 py-1 rounded-md font-medium">
            {card.from}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/subsidie/aanvragen"
          className="bg-yellow-400 hover:bg-yellow-500 text-primary font-bold py-3 px-4 rounded-xl transition duration-300 text-sm text-center"
        >
          Direct regelen
        </Link>
        <Link
          href="/faq"
          className="bg-white border-2 border-surface text-secondary hover:border-secondary font-bold py-3 px-4 rounded-xl transition duration-300 text-sm text-center"
        >
          Meer info
        </Link>
      </div>
    </div>
  );
}

export default function SubsidiesFilter() {
  const [activeTab, setActiveTab] = useState("Particulier");
  const cards = subsidyCards[activeTab] || [];

  return (
    <section id="subsidies" className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-background rounded-full p-1.5 shadow-sm border border-blue-50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-secondary/20 text-primary shadow-sm"
                    : "text-gray-600 hover:text-primary hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <SubsidyCard key={index} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
