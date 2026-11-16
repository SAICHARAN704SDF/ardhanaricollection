import { databaseEnabled } from '@/lib/supabase/client';
import { adminDatabase } from '@/lib/supabase/server';
import { readCatalog, saveEntry } from "@/lib/catalog/repository";
export const dynamic = "force-dynamic";
async function allowed(request: Request) {
  if(databaseEnabled()){try{await adminDatabase();return true;}catch{return false;}}
  const host = request.headers.get("host") || "";
  const origin = request.headers.get("origin");
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host);
  return (
    process.env.NODE_ENV === "development" &&
    local &&
    (!origin || origin === `http://${host}` || origin === `https://${host}`)
  );
}
export async function GET(request: Request) {
  if (!(await allowed(request)))
    return Response.json(
      {
        error:
          "Catalog editing is available only in the local development preview. Secure admin authentication is required before deployment.",
      },
      { status: 403 },
    );
  return Response.json(await readCatalog(), {
    headers: { "Cache-Control": "no-store" },
  });
}
export async function POST(request: Request) {
  if (!(await allowed(request)))
    return Response.json({ error: "Local editing only." }, { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 12000000)
      return Response.json(
        { error: "Images are too large. Use fewer or smaller photos." },
        { status: 413 },
      );
    const body = JSON.parse(raw);
    if (
      !["product", "collection"].includes(body.kind) ||
      !Number.isInteger(body.revision)
    )
      throw new Error("Invalid catalog request.");
    return Response.json(
      await saveEntry(
        body.kind,
        body.entry,
        body.revision,
        body.existing === true,
      ),
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Could not save catalog.",
      },
      { status: 400 },
    );
  }
}
