import { getSupabaseAdmin } from "@/lib/supabase";

// Lightweight Prisma-like compatibility layer backed by Supabase
// Only implements the subset of methods used in the app.
// Tables are assumed to be snake_case versions of the Prisma models.

type Where = Record<string, any>;

type FindOptions = {
	where?: Where;
	orderBy?: Record<string, "asc" | "desc">;
	take?: number;
	include?: Record<string, any>;
};

type CreateOptions = { data: any };

type UpdateOptions = { where: Where; data: any };

type UpsertOptions = { where: Where; create: any; update: any };

type DeleteOptions = { where: Where };
function applyWhere(q: any, where: Where) {
  for (const [k, v] of Object.entries(where)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      // operator object
      if ("gte" in v) q = q.gte(k, (v as any).gte instanceof Date ? (v as any).gte.toISOString() : (v as any).gte);
      if ("gt" in v) q = q.gt(k, (v as any).gt instanceof Date ? (v as any).gt.toISOString() : (v as any).gt);
      if ("lte" in v) q = q.lte(k, (v as any).lte instanceof Date ? (v as any).lte.toISOString() : (v as any).lte);
      if ("lt" in v) q = q.lt(k, (v as any).lt instanceof Date ? (v as any).lt.toISOString() : (v as any).lt);
      if ("in" in v) q = q.in(k, (v as any).in);
    } else if (Array.isArray(v)) {
      q = q.in(k, v);
    } else if (v !== undefined) {
      q = q.eq(k, v);
    }
  }
  return q;
}

function getSingleKey(where: Where | undefined) {
	if (!where) return null;
	const keys = Object.keys(where);
	return keys.length === 1 ? keys[0] : null;
}

async function selectOne(table: string, where?: Where) {
	const supabaseAdmin = getSupabaseAdmin();
	let q = supabaseAdmin.from(table).select("*");
	if (where) {
		q = applyWhere(q, where);
	}
	const { data, error } = await q.maybeSingle();
	if (error) throw error;
	return data;
}

async function insertOne(table: string, data: any) {
	const supabaseAdmin = getSupabaseAdmin();
	const { data: row, error } = await supabaseAdmin.from(table).insert([data]).select("*").maybeSingle();
	if (error) throw error;
	return row;
}

async function updateWhere(table: string, where: Where, data: any) {
	const supabaseAdmin = getSupabaseAdmin();
	let q = supabaseAdmin.from(table).update(data);
	q = applyWhere(q, where);
	const { data: row, error } = await q.select("*").maybeSingle();
	if (error) throw error;
	return row;
}

async function deleteWhere(table: string, where: Where) {
	const supabaseAdmin = getSupabaseAdmin();
	let q = supabaseAdmin.from(table).delete();
	q = applyWhere(q, where);
	const { error } = await q;
	if (error) throw error;
	return { ok: true } as any;
}

async function selectMany(table: string, opts: FindOptions = {}) {
	const supabaseAdmin = getSupabaseAdmin();
	let q = supabaseAdmin.from(table).select("*");
	if (opts.where) {
		q = applyWhere(q, opts.where);
	}
	if (opts.orderBy) {
		const orderBys = Array.isArray(opts.orderBy) ? opts.orderBy : [opts.orderBy];
		for (const ob of orderBys as any[]) {
			for (const [k, dir] of Object.entries(ob)) {
				q = q.order(k, { ascending: (dir as any) === "asc" });
			}
		}
	}
	if (opts.take) q = q.limit(opts.take);
	const { data, error } = await q;
	if (error) throw error;
	return data || [];
}

// Include helpers for common relations used in this app
async function includeUserOnAppointments(appts: any[]) {
	if (!appts.length) return appts;
	const userIds = Array.from(new Set(appts.map((a) => a.userId).filter(Boolean)));
	const vetIds = Array.from(new Set(appts.map((a) => a.vetId).filter(Boolean)));
	const supabaseAdmin = getSupabaseAdmin();
	const [usersRes, vetsRes] = await Promise.all([
		supabaseAdmin.from("users").select("*").in("id", userIds),
		vetIds.length ? supabaseAdmin.from("vet_profiles").select("*", { count: "exact" }).in("id", vetIds) : Promise.resolve({ data: [], error: null } as any),
	]);
	if ((usersRes as any).error) throw (usersRes as any).error;
	if ((vetsRes as any).error) throw (vetsRes as any).error;
	const usersById = new Map(((usersRes as any).data || []).map((u: any) => [u.id, u]));
	const vetsById = new Map(((vetsRes as any).data || []).map((v: any) => [v.id, v]));
	// attach vet.user as well
	const vetUserIds = Array.from(new Set(((vetsRes as any).data || []).map((v: any) => v.userId).filter(Boolean)));
	const vetUsersRes = vetUserIds.length ? await getSupabaseAdmin().from("users").select("*").in("id", vetUserIds) : ({ data: [], error: null } as any);
	if ((vetUsersRes as any).error) throw (vetUsersRes as any).error;
	const vetUsersById = new Map(((vetUsersRes as any).data || []).map((u: any) => [u.id, u]));
	return appts.map((a) => {
		const vetRow: any = vetsById.get(a.vetId || "") || null;
		const vetUser = vetRow ? vetUsersById.get(vetRow.userId) || null : null;
		return {
			...(a as any),
			user: usersById.get(a.userId) || null,
			vet: vetRow ? { ...(vetRow as any), user: vetUser } : null,
		};
	});
}

// Attach user relation on vet_profiles
async function includeUserOnVetProfiles(vetProfiles: any[]) {
    if (!vetProfiles.length) return vetProfiles;
    const userIds = Array.from(new Set(vetProfiles.map((v) => v.userId).filter(Boolean)));
    if (!userIds.length) return vetProfiles.map((v) => ({ ...(v as any), user: null }));
    const { data: users, error } = await getSupabaseAdmin().from("users").select("*").in("id", userIds);
    if (error) throw error;
    const usersById = new Map((users || []).map((u: any) => [u.id, u]));
    return vetProfiles.map((v) => ({ ...(v as any), user: usersById.get(v.userId) || null }));
}

async function includeMembershipOnUsers(users: any[]) {
	if (!users.length) return users;
	const userIds = Array.from(new Set(users.map((u) => u.id)));
	const { data: mships, error } = await getSupabaseAdmin().from("memberships").select("*").in("userId", userIds);
	if (error) throw error;
	const byUserId = new Map((mships || []).map((m) => [m.userId, m]));
	return users.map((u) => ({ ...u, membership: byUserId.get(u.id) || null }));
}

async function includeAppointmentsOnUsers(users: any[], opts?: any) {
    if (!users.length) return users;
    const userIds = Array.from(new Set(users.map((u) => u.id)));
    let q = getSupabaseAdmin().from("appointments").select("*").in("userId", userIds);
    q = q.order("startTime", { ascending: false });
    const { data: appts, error } = await q;
    if (error) throw error;
    const byUser = new Map<string, any[]>(userIds.map((id) => [id, []]));
    for (const a of (appts || [])) {
        const arr = byUser.get((a as any).userId);
        if (arr) arr.push(a);
    }
    return users.map((u) => ({ ...(u as any), appointments: byUser.get(u.id) || [] }));
}

function model(table: string, options?: { includeHandler?: (rows: any[], include?: any) => Promise<any[]>; includeSingleHandler?: (row: any, include?: any) => Promise<any> }) {
	return {
		async findUnique(opts: FindOptions) {
			const row = await selectOne(table, opts.where);
			if (!row) return null;
			if (options?.includeSingleHandler && opts.include) return await options.includeSingleHandler(row, opts.include);
			return row;
		},
		async findFirst(opts: FindOptions = {}) {
			const row = await selectOne(table, opts.where);
			if (!row) return null;
			if (options?.includeSingleHandler && opts.include) return await options.includeSingleHandler(row, opts.include);
			return row;
		},
		async findMany(opts: FindOptions = {}) {
			const rows = await selectMany(table, opts);
			if (options?.includeHandler && opts.include) return await options.includeHandler(rows, opts.include);
			return rows;
		},
		async create(opts: CreateOptions) {
			return await insertOne(table, opts.data);
		},
		async update(opts: UpdateOptions) {
			return await updateWhere(table, opts.where, opts.data);
		},
		async upsert(opts: UpsertOptions) {
			const key = getSingleKey(opts.where);
			if (!key) throw new Error("upsert requires single-key where");
			const existing = await selectOne(table, opts.where);
			if (existing) {
				return await updateWhere(table, { [key]: (opts.where as any)[key] }, opts.update);
			}
			return await insertOne(table, { ...(opts.create || {}), ...(opts.where || {}) });
		},
		async delete(opts: DeleteOptions) {
			return await deleteWhere(table, opts.where);
		},
	};
}

export const prisma = {
	user: model("users", {
		includeHandler: async (rows, include) => {
			let out = rows;
			if (include?.membership) out = await includeMembershipOnUsers(out);
			if (include?.appointments) out = await includeAppointmentsOnUsers(out, include?.appointments);
			return out;
		},
		includeSingleHandler: async (row, include) => {
			let out = row;
			if (include?.membership) out = (await includeMembershipOnUsers([out]))[0];
			if (include?.appointments) out = (await includeAppointmentsOnUsers([out], include?.appointments))[0];
			return out;
		},
	}),
	vetProfile: model("vet_profiles", {
		includeHandler: async (rows, include) => {
			if (include?.user) return await includeUserOnVetProfiles(rows);
			return rows;
		},
		includeSingleHandler: async (row, include) => {
			if (include?.user) return (await includeUserOnVetProfiles([row]))[0];
			return row;
		},
	}),
	qaItem: model("qa_items"),
	blogPost: model("blog_posts"),
	availability: model("availability"),
	appointment: model("appointments", {
		includeHandler: async (rows, include) => {
			if (include?.user || include?.vet) return await includeUserOnAppointments(rows);
			return rows;
		},
		includeSingleHandler: async (row, include) => {
			if (include?.user || include?.vet) return (await includeUserOnAppointments([row]))[0];
			return row;
		},
	}),
	membership: model("memberships"),
	oTP: model("otps"),
	partnerCode: model("partner_codes"),
	partnerCodeBatch: model("partner_code_batches"),
	partnerCompany: model("partner_companies"),
	partnerRedemption: model("partner_redemptions"),
	session: model("sessions"),
	apptManageToken: model("appt_manage_tokens"),
	freeConsultToken: model("free_consult_tokens"),
	adminSettings: model("admin_settings"),
} as any;

