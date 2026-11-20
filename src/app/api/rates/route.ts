import { getRates } from "@/lib/rates";

export const revalidate = 60;

export async function GET() {
  return Response.json(await getRates(), { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } });
}
