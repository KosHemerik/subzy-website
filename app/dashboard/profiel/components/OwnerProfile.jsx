"use client";

import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-blue-100/60 last:border-0">
      <dt className="w-48 flex-shrink-0 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm font-semibold text-primary">
        {value || <span className="font-normal text-gray-400 italic">Niet ingevuld</span>}
      </dd>
    </div>
  );
}

export default function OwnerProfile() {
  const { user, owner: authOwner } = useAuth();
  const [owner, setOwner]         = useState(authOwner || null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    if (!authOwner?.id) {
      setOwner(null);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setOwner(authOwner);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data, error: err } = await supabase
          .from("owners")
          .select(
            "id, portal_status, firstName, lastName, companyName, displayName, ownerType, " +
            "emailAddress, phoneNumber, street, houseNumber, addition, postalCode, city"
          )
          .eq("id", authOwner.id)
          .maybeSingle();

        if (err) throw err;
        setOwner({ ...authOwner, ...(data || {}) });
      } catch (e) {
        setOwner(authOwner);
        setError("Niet alle profielgegevens konden worden geladen.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authOwner, authOwner?.id]);

  const addressLine = owner
    ? [
        [owner.street, owner.houseNumber, owner.addition].filter(Boolean).join(" "),
        [owner.postalCode, owner.city].filter(Boolean).join(" "),
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  const ownerTypeRaw = owner?.ownerType;
  const ownerTypeValue =
    typeof ownerTypeRaw === "number"
      ? ownerTypeRaw
      : typeof ownerTypeRaw === "string"
        ? Number(ownerTypeRaw)
        : typeof ownerTypeRaw === "object" && ownerTypeRaw !== null
          ? Number(ownerTypeRaw.value || ownerTypeRaw.id)
          : NaN;

  const ownerTypeLabel =
    ownerTypeValue === 2 ? "Bedrijf" : ownerTypeValue === 1 ? "Particulier" : "Onbekend";

  return (
    <main className="flex-grow p-4 sm:p-8 w-full overflow-y-auto relative bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.18)_100%)] backdrop-blur-sm">
      {/* Header */}
      <div className="mb-8">
        <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/90 px-3 py-1 text-xs font-semibold text-secondary shadow-sm mb-3">
          Klantportaal
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
          Mijn Profiel
        </h1>
        <p className="text-gray-600 mt-1">Uw persoonlijke en contactgegevens.</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <i className="fa-solid fa-spinner fa-spin text-3xl mb-3" />
          <p>Gegevens laden…</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-600 text-sm">
          <i className="fa-solid fa-circle-exclamation mr-2" />
          {error}
        </div>
      ) : (
        <div>
          <div className="rounded-2xl border border-blue-100/60 bg-white/80 shadow-sm p-6">
            <h2 className="text-base font-bold text-primary mb-4">Persoonsgegevens</h2>
            <dl>
              <InfoRow label="Type" value={ownerTypeLabel} />
              {ownerTypeValue === 2 ? (
                <InfoRow label="Bedrijfsnaam"  value={owner?.companyName} />
              ) : (
                <>
                  <InfoRow label="Voornaam"   value={owner?.firstName} />
                  <InfoRow label="Achternaam" value={owner?.lastName} />
                </>
              )}
              {owner?.displayName && (
                <InfoRow label="Weergavenaam" value={owner.displayName} />
              )}
              <InfoRow label="E-mailadres"  value={owner?.emailAddress || user?.email} />
              <InfoRow label="Telefoonnummer" value={owner?.phoneNumber} />
              <InfoRow label="Adres" value={addressLine} />
            </dl>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Wil je gegevens wijzigen? Neem contact op via{" "}
            <a href="mailto:info@subzy.nl" className="text-secondary hover:underline">
              info@subzy.nl
            </a>{" "}
            of{" "}
            <a href="tel:+31712032405" className="text-secondary hover:underline">
              +31 71 203 2405
            </a>
            .
          </p>
        </div>
      )}
    </main>
  );
}
