import { prisma } from "@/lib/prisma";
import { requireVet } from "@/lib/rbac";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireVet();
  const form = await req.formData();
  const notes = String(form.get("notes") ?? "");
  const subjective = String(form.get("subjective") ?? "");
  const objective = String(form.get("objective") ?? "");
  const assessment = String(form.get("assessment") ?? "");
  const plan = String(form.get("plan") ?? "");
  const consultationSummary = String(form.get("consultationSummary") ?? form.get("clientSummary") ?? "");
  await prisma.appointment.update({ where: { id: params.id }, data: { notes, soap: { subjective, objective, assessment, plan, consultationSummary } as any } });
  return new Response(null, { status: 302, headers: { Location: `/vet/appointments/${params.id}` } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await requireVet();
  const body = await req.json().catch(() => ({}));
  const notes = typeof body.notes === 'string' ? body.notes : undefined;
  const soap = body.soap && typeof body.soap === 'object' ? body.soap : undefined;
  if (notes === undefined && soap === undefined) return new Response("Bad Request", { status: 400 });
  // Map legacy clientSummary to consultationSummary if provided
  const soapData = soap ? { ...soap } : undefined;
  if (soapData && (soapData as any).clientSummary && !(soapData as any).consultationSummary) {
    (soapData as any).consultationSummary = (soapData as any).clientSummary;
    delete (soapData as any).clientSummary;
  }
  const appt = await prisma.appointment.update({ where: { id: params.id }, data: { ...(notes!==undefined?{notes}:{ }), ...(soapData!==undefined?{soap: soapData}:{}) } });
  return Response.json({ ok: true, id: appt.id });
}

