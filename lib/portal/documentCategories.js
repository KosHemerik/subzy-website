// Documentcategorieën per aanvraagtype (requests.requestType) voor het
// klantportaal. Moet exact overeenkomen met DOCUMENT_CATEGORIES in
// subsy-dashboard/src/utils/constants.js en met wat er in
// requestDocuments.category / request_document_requests.category staat.
// Wijzigt daar iets, pas het hier ook aan.
export const DOCUMENT_CATEGORIES_BY_REQUEST_TYPE = {
	1: [
		// Energiebelasting
		{ id: "energienota", label: "Energienota", description: "De jaarafrekening van uw energieleverancier." },
		{ id: "woz-aanslag", label: "WOZ-aanslag", description: "De WOZ-aanslag van uw gemeente." },
		{ id: "aanvraag", label: "Aanvraag", description: "Het ingediende aanvraagdocument voor dit dossier.", readOnly: true },
		{ id: "bevestiging", label: "Bevestiging", description: "De bevestiging van een ingediende aanvraag.", readOnly: true },
		{ id: "overig", label: "Overige documenten", description: "Aanvullende documenten die niet in een vaste categorie vallen." },
	],
	2: [
		// SVOH
		{ id: "factuur", label: "Factuur", description: "De factuur van de uitgevoerde werkzaamheden." },
		{ id: "offerte", label: "Offerte", description: "De offerte voor de uitgevoerde werkzaamheden." },
		{ id: "betalingsbewijs", label: "Betalingsbewijs", description: "Het bewijs van betaling van de factuur." },
		{ id: "fotos", label: "Foto's", description: "Foto's van de uitgevoerde werkzaamheden." },
		{ id: "aanvraag", label: "Aanvraag", description: "Het ingediende aanvraagdocument voor dit dossier.", readOnly: true },
		{ id: "bevestiging", label: "Bevestiging", description: "De bevestiging van een ingediende aanvraag.", readOnly: true },
		{ id: "overig", label: "Overige documenten", description: "Aanvullende documenten die niet in een vaste categorie vallen." },
	],
};
// ISDE gebruikt dezelfde categorieën als SVOH.
DOCUMENT_CATEGORIES_BY_REQUEST_TYPE[3] = DOCUMENT_CATEGORIES_BY_REQUEST_TYPE[2];

export function getDocumentCategoriesForRequestType(requestType) {
	return DOCUMENT_CATEGORIES_BY_REQUEST_TYPE[Number(requestType)] || DOCUMENT_CATEGORIES_BY_REQUEST_TYPE[1];
}

// Vlakke label-map over alle aanvraagtypes heen, voor plekken (bv.
// meldingen) die alleen een categorie-id hebben en geen aanvraagtype.
export const REQUESTABLE_DOCUMENT_LABELS = Object.values(DOCUMENT_CATEGORIES_BY_REQUEST_TYPE)
	.flat()
	.reduce((acc, category) => {
		acc[category.id] = category.label;
		return acc;
	}, {});

export function getDocumentCategoryLabel(category) {
	return REQUESTABLE_DOCUMENT_LABELS[category] || category;
}
