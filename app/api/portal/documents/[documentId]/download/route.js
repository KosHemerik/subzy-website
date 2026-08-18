import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const BUCKET = "request-documents";

function isInternalStorageError(error) {
  const status = String(error?.statusCode || "");
  const message = String(error?.message || "").toLowerCase();
  return status === "500" || message.includes("internal server error");
}

function createMirrorStorageClient() {
  const mirrorUrl = process.env.SUPABASE_STORAGE_MIRROR_URL;
  const mirrorAnonKey = process.env.SUPABASE_STORAGE_MIRROR_ANON_KEY;

  if (!mirrorUrl || !mirrorAnonKey) return null;
  return createClient(mirrorUrl, mirrorAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function normalizeStoragePath(inputPath) {
  if (!inputPath) return null;

  let path = String(inputPath).trim();
  path = path.replace(/^https?:\/\/[^/]+\/storage\/v1\/object\/(?:public|sign|authenticated)\//, "");
  path = path.replace(/^\/?object\/(?:public|sign|authenticated)\//, "");
  path = path.replace(/^\/?request-documents\//, "");
  path = path.replace(/^\/+/, "");

  return path || null;
}

async function getOwnerIdForPortalUser(supabase, portalUserId) {
  const { data: ownerRow, error } = await supabase
    .from("owners")
    .select("id")
    .eq("portal_user_id", portalUserId)
    .eq("portal_status", "active")
    .maybeSingle();

  if (error) throw error;
  return ownerRow?.id || null;
}

async function getRequestDocumentWithOwnershipCheck(supabase, documentId, ownerId) {
  const { data: document, error: docError } = await supabase
    .from("requestDocuments")
    .select("id, requestId, name, storagePath")
    .eq("id", documentId)
    .maybeSingle();

  if (docError) throw docError;
  if (!document) return { document: null, authorized: false };

  const { data: request, error: requestError } = await supabase
    .from("requests")
    .select("id, addressId")
    .eq("id", document.requestId)
    .maybeSingle();

  if (requestError) throw requestError;
  if (!request) return { document, authorized: false };

  const { data: address, error: addressError } = await supabase
    .from("addresses")
    .select("id")
    .eq("id", request.addressId)
    .eq("ownerId", ownerId)
    .maybeSingle();

  if (addressError) throw addressError;

  return { document, authorized: !!address };
}

export async function GET(req, context) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const supabase = createServerSupabaseClient(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Sessie ongeldig." }, { status: 401 });
    }

    const ownerId = await getOwnerIdForPortalUser(supabase, user.id);

    if (!ownerId) {
      return NextResponse.json(
        { error: "Geen actief portal-account gekoppeld aan een eigenaar." },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(context?.params);
    const documentId = String(resolvedParams?.documentId || "").trim();
    if (!documentId) {
      return NextResponse.json({ error: "Ongeldig document-id." }, { status: 400 });
    }

    const { document, authorized } = await getRequestDocumentWithOwnershipCheck(
      supabase,
      documentId,
      ownerId
    );

    if (!document) {
      return NextResponse.json({ error: "Document niet gevonden." }, { status: 404 });
    }

    if (!authorized) {
      return NextResponse.json({ error: "Geen toegang tot dit document." }, { status: 403 });
    }

    const storagePath = normalizeStoragePath(document.storagePath);

    if (!storagePath) {
      return NextResponse.json({ error: "Opslagpad ontbreekt." }, { status: 400 });
    }

    const { data: primaryFileData, error: primaryDownloadError } = await supabase.storage
      .from(BUCKET)
      .download(storagePath);

    let fileData = primaryFileData;
    let primaryDetails = null;
    let mirrorDetails = null;

    if (primaryDownloadError || !fileData) {
      primaryDetails = primaryDownloadError
        ? {
            name: primaryDownloadError.name || null,
            message: primaryDownloadError.message || null,
            statusCode: primaryDownloadError.statusCode || null,
            error: primaryDownloadError.error || null,
            code: primaryDownloadError.code || null,
          }
        : null;

      if (primaryDownloadError && isInternalStorageError(primaryDownloadError)) {
        const mirrorClient = createMirrorStorageClient();
        if (mirrorClient) {
          const { data: mirrorFileData, error: mirrorDownloadError } = await mirrorClient.storage
            .from(BUCKET)
            .download(storagePath);

          if (!mirrorDownloadError && mirrorFileData) {
            fileData = mirrorFileData;
          } else if (mirrorDownloadError) {
            mirrorDetails = {
              name: mirrorDownloadError.name || null,
              message: mirrorDownloadError.message || null,
              statusCode: mirrorDownloadError.statusCode || null,
              error: mirrorDownloadError.error || null,
              code: mirrorDownloadError.code || null,
            };
          }
        }
      }
    }

    if (!fileData) {
      const details = {
        primary: primaryDetails,
        mirror: mirrorDetails,
      };

      console.error("Portal document download failed", {
        documentId,
        ownerId,
        storagePath,
        downloadError: details.primary,
        mirrorDownloadError: details.mirror,
      });

      return NextResponse.json(
        {
          error:
            "Bestand kan niet worden opgehaald. Controleer of het fysiek aanwezig is in storage.",
          details,
        },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const dispositionParam = req.nextUrl.searchParams.get("disposition");
    const contentDisposition = dispositionParam === "attachment" ? "attachment" : "inline";

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": fileData.type || "application/octet-stream",
        "Content-Disposition": `${contentDisposition}; filename="${document.name || "document"}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Interne fout bij ophalen van document.",
        details: error instanceof Error ? error.message : "Onbekende fout",
      },
      { status: 500 }
    );
  }
}
