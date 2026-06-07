const EDSN_BASE_URL = "https://gateway.edsn.nl/eancodeboek/v1";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postalCode = searchParams.get("postalCode");
  const streetNumber = searchParams.get("streetNumber");
  const streetNumberAddition = searchParams.get("streetNumberAddition") || "";
  const product = searchParams.get("product") || "ELK";

  if (!postalCode || !streetNumber) {
    return Response.json(
      { error: "postalCode en streetNumber zijn verplicht" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    product: product.toUpperCase(),
    postalCode: postalCode.replace(/\s/g, "").toUpperCase(),
    streetNumber: String(streetNumber),
    limit: "50",
    offset: "0",
  });
  if (streetNumberAddition) {
    params.set("streetNumberAddition", streetNumberAddition.trim().toUpperCase());
  }

  try {
    const edsnRes = await fetch(`${EDSN_BASE_URL}/ecbinfoset?${params}`, {
      headers: { accept: "application/json" },
    });
    const data = await edsnRes.json();
    return Response.json(data, { status: edsnRes.status });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
