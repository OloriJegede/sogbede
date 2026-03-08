/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Database Proxy Client for SoGbédè
 *
 * Replaces direct Prisma MySQL connection with HTTP calls to a PHP proxy
 * deployed on the Namecheap server. Provides a Prisma-compatible interface
 * so existing code doesn't need changes.
 */

// ============================================================
// Types
// ============================================================

type Direction = "has" | "belongs";
type RelType = "one" | "many";

interface Relation {
  model: string;
  direction: Direction;
  type: RelType;
  fk: string; // 'has': field in TARGET. 'belongs': field in US.
}

interface ModelDef {
  table: string;
  pk: string;
  fields: Record<string, string>; // camelCase → column
  reverseFields: Record<string, string>; // column → camelCase
  dateFields: string[];
  booleanFields: string[];
  relations: Record<string, Relation>;
}

interface QueryResult {
  rows: any[];
  insertId: number | null;
  affectedRows: number;
  error?: string;
}

// ============================================================
// Schema Definitions
// ============================================================

function m(
  table: string,
  pk: string,
  pairs: [string, string][],
  dateFields: string[],
  booleanFields: string[],
  relations: Record<string, Relation>,
): ModelDef {
  const fields: Record<string, string> = {};
  const reverseFields: Record<string, string> = {};
  for (const [camel, col] of pairs) {
    fields[camel] = col;
    reverseFields[col] = camel;
  }
  return {
    table,
    pk,
    fields,
    reverseFields,
    dateFields,
    booleanFields,
    relations,
  };
}

const S: Record<string, ModelDef> = {
  application: m(
    "applications",
    "id",
    [
      ["id", "id"],
      ["firstName", "first_name"],
      ["lastName", "last_name"],
      ["email", "email"],
      ["phone", "phone"],
      ["city", "city"],
      ["state", "state"],
      ["country", "country"],
      ["age", "age"],
      ["occupation", "occupation"],
      ["interests", "interests"],
      ["filmingDate", "filming_date"],
      ["partnerFirstName", "partner_first_name"],
      ["partnerLastName", "partner_last_name"],
      ["mediaUrl", "media_url"],
      ["mediaFilename", "media_filename"],
      ["mediaSize", "media_size"],
      ["mediaType", "media_type"],
      ["status", "status"],
      ["createdAt", "created_at"],
      ["updatedAt", "updated_at"],
      ["adminNotes", "admin_notes"],
      ["instagramHandle", "instagram_handle"],
      ["tiktokHandle", "tiktok_handle"],
      ["additionalNotes", "additional_notes"],
    ],
    ["filmingDate", "createdAt", "updatedAt"],
    [],
    {
      visibility: {
        model: "adminApplicationVisibility",
        direction: "has",
        type: "one",
        fk: "applicationId",
      },
      categories: {
        model: "applicationCategory",
        direction: "has",
        type: "many",
        fk: "applicationId",
      },
      consentRecord: {
        model: "consentRecord",
        direction: "has",
        type: "one",
        fk: "applicationId",
      },
      consentRequest: {
        model: "consentRequest",
        direction: "has",
        type: "one",
        fk: "applicationId",
      },
      emailStatuses: {
        model: "castingEmailDeliveryStatus",
        direction: "has",
        type: "many",
        fk: "applicationId",
      },
      episodeMembers: {
        model: "episodeMember",
        direction: "has",
        type: "many",
        fk: "applicationId",
      },
    },
  ),

  adminApplicationVisibility: m(
    "admin_application_visibility",
    "id",
    [
      ["id", "id"],
      ["applicationId", "application_id"],
      ["isHidden", "is_hidden"],
      ["hiddenAt", "hidden_at"],
      ["hiddenReason", "hidden_reason"],
      ["createdAt", "created_at"],
      ["updatedAt", "updated_at"],
    ],
    ["hiddenAt", "createdAt", "updatedAt"],
    ["isHidden"],
    {
      application: {
        model: "application",
        direction: "belongs",
        type: "one",
        fk: "applicationId",
      },
    },
  ),

  adminSetting: m(
    "admin_settings",
    "id",
    [
      ["id", "id"],
      ["settingKey", "setting_key"],
      ["settingValue", "setting_value"],
      ["createdAt", "created_at"],
      ["updatedAt", "updated_at"],
    ],
    ["createdAt", "updatedAt"],
    [],
    {},
  ),

  category: m(
    "categories",
    "id",
    [
      ["id", "id"],
      ["categoryName", "category_name"],
      ["categorySlug", "category_slug"],
      ["description", "description"],
      ["colorCode", "color_code"],
      ["isExclusive", "is_exclusive"],
      ["sortOrder", "sort_order"],
      ["createdAt", "created_at"],
      ["updatedAt", "updated_at"],
    ],
    ["createdAt", "updatedAt"],
    ["isExclusive"],
    {
      applications: {
        model: "applicationCategory",
        direction: "has",
        type: "many",
        fk: "categoryId",
      },
    },
  ),

  applicationCategory: m(
    "application_categories",
    "id",
    [
      ["id", "id"],
      ["applicationId", "application_id"],
      ["categoryId", "category_id"],
      ["assignedAt", "assigned_at"],
      ["assignedBy", "assigned_by"],
    ],
    ["assignedAt"],
    [],
    {
      application: {
        model: "application",
        direction: "belongs",
        type: "one",
        fk: "applicationId",
      },
      category: {
        model: "category",
        direction: "belongs",
        type: "one",
        fk: "categoryId",
      },
    },
  ),

  castingEmailDeliveryStatus: m(
    "casting_email_delivery_status",
    "recipientKey",
    [
      ["recipientKey", "recipient_key"],
      ["applicationId", "application_id"],
      ["email", "email"],
      ["lastStatus", "last_status"],
      ["lastError", "last_error"],
      ["lastSubject", "last_subject"],
      ["attemptCount", "attempt_count"],
      ["successCount", "success_count"],
      ["lastAttemptAt", "last_attempt_at"],
      ["lastSuccessAt", "last_success_at"],
      ["createdAt", "created_at"],
      ["updatedAt", "updated_at"],
    ],
    ["lastAttemptAt", "lastSuccessAt", "createdAt", "updatedAt"],
    [],
    {
      application: {
        model: "application",
        direction: "belongs",
        type: "one",
        fk: "applicationId",
      },
    },
  ),

  consentRecord: m(
    "consent_records",
    "id",
    [
      ["id", "id"],
      ["applicationId", "application_id"],
      ["consentSignedAt", "consent_signed_at"],
      ["lastFourDigits", "last_four_digits"],
      ["createdAt", "created_at"],
    ],
    ["consentSignedAt", "createdAt"],
    [],
    {
      application: {
        model: "application",
        direction: "belongs",
        type: "one",
        fk: "applicationId",
      },
    },
  ),

  consentRequest: m(
    "consent_requests",
    "id",
    [
      ["id", "id"],
      ["applicationId", "application_id"],
      ["status", "status"],
      ["createdAt", "created_at"],
      ["updatedAt", "updated_at"],
    ],
    ["createdAt", "updatedAt"],
    [],
    {
      application: {
        model: "application",
        direction: "belongs",
        type: "one",
        fk: "applicationId",
      },
    },
  ),

  episode: m(
    "episodes",
    "id",
    [
      ["id", "id"],
      ["episodeNumber", "episode_number"],
      ["title", "title"],
      ["shootDate", "shoot_date"],
      ["status", "status"],
      ["notes", "notes"],
      ["createdAt", "created_at"],
      ["updatedAt", "updated_at"],
    ],
    ["shootDate", "createdAt", "updatedAt"],
    [],
    {
      members: {
        model: "episodeMember",
        direction: "has",
        type: "many",
        fk: "episodeId",
      },
    },
  ),

  episodeMember: m(
    "episode_members",
    "id",
    [
      ["id", "id"],
      ["episodeId", "episode_id"],
      ["applicationId", "application_id"],
      ["fullNameSnapshot", "full_name_snapshot"],
      ["emailSnapshot", "email_snapshot"],
      ["photoUrlSnapshot", "photo_url_snapshot"],
      ["teamNumber", "team_number"],
      ["seatNumber", "seat_number"],
      ["createdAt", "created_at"],
    ],
    ["createdAt"],
    [],
    {
      episode: {
        model: "episode",
        direction: "belongs",
        type: "one",
        fk: "episodeId",
      },
      application: {
        model: "application",
        direction: "belongs",
        type: "one",
        fk: "applicationId",
      },
    },
  ),

  filmingCalendar: m(
    "filming_calendar",
    "id",
    [
      ["id", "id"],
      ["date", "date"],
      ["status", "status"],
      ["capacityLimit", "capacity_limit"],
      ["isManualOverride", "is_manual_override"],
      ["notes", "notes"],
      ["createdAt", "created_at"],
      ["updatedAt", "updated_at"],
    ],
    ["date", "createdAt", "updatedAt"],
    ["isManualOverride"],
    {},
  ),

  admin: m(
    "admins",
    "id",
    [
      ["id", "id"],
      ["email", "email"],
      ["password", "password"],
      ["name", "name"],
      ["createdAt", "created_at"],
    ],
    ["createdAt"],
    [],
    {},
  ),
};

// ============================================================
// SQL Helpers
// ============================================================

function fmtVal(value: any): any {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 19).replace("T", " ");
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  return value;
}

function buildWhere(mn: string, where: any): { sql: string; params: any[] } {
  if (!where || Object.keys(where).length === 0) return { sql: "", params: [] };

  const model = S[mn];
  const conds: string[] = [];
  const params: any[] = [];

  for (const [key, value] of Object.entries(where)) {
    if (key === "OR" && Array.isArray(value)) {
      const parts: string[] = [];
      for (const item of value) {
        const sub = buildWhere(mn, item);
        if (sub.sql) {
          parts.push(`(${sub.sql})`);
          params.push(...sub.params);
        }
      }
      if (parts.length) conds.push(`(${parts.join(" OR ")})`);
      continue;
    }
    if (key === "AND" && Array.isArray(value)) {
      for (const item of value) {
        const sub = buildWhere(mn, item);
        if (sub.sql) {
          conds.push(sub.sql);
          params.push(...sub.params);
        }
      }
      continue;
    }
    if (key === "NOT") {
      const sub = buildWhere(mn, value);
      if (sub.sql) {
        conds.push(`NOT (${sub.sql})`);
        params.push(...sub.params);
      }
      continue;
    }

    const col = model.fields[key];
    if (!col) {
      // Check if this is a relation filter (e.g. categories: { some: { categoryId: X } })
      const rel = model.relations[key];
      if (
        rel &&
        typeof value === "object" &&
        value !== null &&
        "some" in value
      ) {
        const relModel = S[rel.model];
        if (relModel) {
          const subWhere = buildWhere(rel.model, value.some);
          const fkCol = relModel.fields[rel.fk];
          if (subWhere.sql) {
            conds.push(
              `${model.fields[model.pk]} IN (SELECT ${fkCol} FROM ${relModel.table} WHERE ${subWhere.sql})`,
            );
            params.push(...subWhere.params);
          } else {
            // { some: {} } means "has at least one"
            conds.push(
              `${model.fields[model.pk]} IN (SELECT ${fkCol} FROM ${relModel.table})`,
            );
          }
        }
      }
      continue;
    }

    if (value === null || value === undefined) {
      conds.push(`${col} IS NULL`);
    } else if (typeof value === "object" && !(value instanceof Date)) {
      const ops = value as Record<string, any>;
      if ("not" in ops) {
        if (ops.not === null) {
          conds.push(`${col} IS NOT NULL`);
        } else {
          conds.push(`${col} != ?`);
          params.push(fmtVal(ops.not));
        }
      }
      if ("in" in ops && Array.isArray(ops.in)) {
        const ph = ops.in.map(() => "?").join(", ");
        conds.push(`${col} IN (${ph})`);
        params.push(...ops.in.map(fmtVal));
      }
      if ("contains" in ops) {
        conds.push(`${col} LIKE ?`);
        params.push(`%${ops.contains}%`);
      }
      if ("startsWith" in ops) {
        conds.push(`${col} LIKE ?`);
        params.push(`${ops.startsWith}%`);
      }
      if ("endsWith" in ops) {
        conds.push(`${col} LIKE ?`);
        params.push(`%${ops.endsWith}`);
      }
      if ("gt" in ops) {
        conds.push(`${col} > ?`);
        params.push(fmtVal(ops.gt));
      }
      if ("gte" in ops) {
        conds.push(`${col} >= ?`);
        params.push(fmtVal(ops.gte));
      }
      if ("lt" in ops) {
        conds.push(`${col} < ?`);
        params.push(fmtVal(ops.lt));
      }
      if ("lte" in ops) {
        conds.push(`${col} <= ?`);
        params.push(fmtVal(ops.lte));
      }
      if ("equals" in ops) {
        conds.push(`${col} = ?`);
        params.push(fmtVal(ops.equals));
      }
    } else {
      conds.push(`${col} = ?`);
      params.push(fmtVal(value));
    }
  }

  return { sql: conds.join(" AND "), params };
}

function buildOrderBy(mn: string, orderBy: any): string {
  if (!orderBy) return "";
  const model = S[mn];
  const items = Array.isArray(orderBy) ? orderBy : [orderBy];
  const parts = items.map((item: any) => {
    const [field, dir] = Object.entries(item)[0] as [string, string];
    return `${model.fields[field] || field} ${dir.toUpperCase()}`;
  });
  return parts.length ? `ORDER BY ${parts.join(", ")}` : "";
}

function buildSelectCols(mn: string, select: any): string {
  if (!select) return "*";
  const model = S[mn];
  const cols = new Set<string>();
  // Always include PK for relation matching
  cols.add(model.fields[model.pk]);
  for (const [k, v] of Object.entries(select)) {
    if (v === true && model.fields[k]) {
      cols.add(model.fields[k]);
    }
  }
  return cols.size ? Array.from(cols).join(", ") : "*";
}

function buildInsert(
  mn: string,
  data: any,
): { columns: string[]; values: any[] } {
  const model = S[mn];
  const columns: string[] = [];
  const values: any[] = [];
  for (const [key, val] of Object.entries(data)) {
    const col = model.fields[key];
    if (!col || val === undefined) continue;
    columns.push(col);
    values.push(fmtVal(val));
  }
  return { columns, values };
}

function buildUpdate(mn: string, data: any): { sets: string[]; values: any[] } {
  const model = S[mn];
  const sets: string[] = [];
  const values: any[] = [];
  for (const [key, val] of Object.entries(data)) {
    const col = model.fields[key];
    if (!col || val === undefined) continue;
    if (typeof val === "object" && val !== null && !(val instanceof Date)) {
      if ("increment" in val) {
        sets.push(`${col} = ${col} + ?`);
        values.push(val.increment);
        continue;
      }
      if ("decrement" in val) {
        sets.push(`${col} = ${col} - ?`);
        values.push(val.decrement);
        continue;
      }
    }
    sets.push(`${col} = ?`);
    values.push(fmtVal(val));
  }
  return { sets, values };
}

// ============================================================
// Row Mapping (DB columns → camelCase fields)
// ============================================================

/**
 * Detect whether a camelCase field name represents an integer column.
 * Covers primary keys, foreign keys, and other known numeric fields.
 * This is needed because some PHP/MySQL driver combos (libmysqlclient)
 * return all values as strings, breaking strict-equality checks in JS.
 */
function isIntField(field: string): boolean {
  if (field === "id" || field === "age") return true;
  const suffixes = ["Id", "Number", "Count", "Size", "Order", "Limit"];
  return suffixes.some((s) => field.endsWith(s));
}

function mapRow(mn: string, row: any): any {
  if (!row) return null;
  const model = S[mn];
  const result: any = {};
  for (const [col, val] of Object.entries(row)) {
    const field = model.reverseFields[col] || col;
    if (model.booleanFields.includes(field)) {
      result[field] = val === null ? null : Boolean(val);
    } else if (
      model.dateFields.includes(field) &&
      val !== null &&
      val !== undefined
    ) {
      result[field] = new Date(val as string);
    } else if (isIntField(field) && val !== null && val !== undefined) {
      result[field] = Number(val);
    } else {
      result[field] = val;
    }
  }
  return result;
}

function mapRows(mn: string, rows: any[]): any[] {
  return rows.map((r) => mapRow(mn, r));
}

// ============================================================
// Query Executor (HTTP → PHP proxy)
// ============================================================

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;
const FETCH_TIMEOUT_MS = 30_000;

// Serialise outgoing proxy requests so we don't open many
// concurrent TCP connections to the shared-hosting server.
let _queue: Promise<any> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const p = _queue.then(fn, fn); // run even if previous rejected
  _queue = p.catch(() => {}); // swallow so chain continues
  return p;
}

async function execQueries(
  queries: { sql: string; params: any[] }[],
): Promise<QueryResult[]> {
  const url = process.env.DB_PROXY_URL;
  const key = process.env.DB_PROXY_KEY;

  if (!url || !key) {
    throw new Error("DB_PROXY_URL and DB_PROXY_KEY must be set in .env");
  }

  return enqueue(async () => {
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey: key, queries }),
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`DB proxy error ${res.status}: ${text}`);
        }

        const data = await res.json();
        return data.results as QueryResult[];
      } catch (err: any) {
        lastError = err;
        const isRetryable =
          err?.cause?.code === "UND_ERR_CONNECT_TIMEOUT" ||
          err?.cause?.code === "ECONNRESET" ||
          err?.cause?.code === "ECONNREFUSED" ||
          err?.cause?.code === "UND_ERR_SOCKET" ||
          err?.name === "AbortError" ||
          err?.message?.includes("fetch failed");

        if (!isRetryable || attempt === MAX_RETRIES - 1) throw err;

        const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        console.warn(
          `[db-proxy] attempt ${attempt + 1} failed (${err?.cause?.code ?? err?.message}), retrying in ${delay}ms…`,
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    throw lastError; // unreachable, but satisfies TS
  });
}

async function execOne(sql: string, params: any[] = []): Promise<QueryResult> {
  const results = await execQueries([{ sql, params }]);
  if (results[0]?.error) throw new Error(results[0].error);
  return results[0];
}

// ============================================================
// Include Resolver (handles relations)
// ============================================================

async function resolveIncludes(
  mn: string,
  rows: any[],
  include: any,
): Promise<void> {
  if (!include || rows.length === 0) return;

  const model = S[mn];

  await Promise.all(
    Object.entries(include).map(async ([relName, relConfig]) => {
      if (!relConfig) return;

      const rel = model.relations[relName];
      if (!rel) return;

      const isObj = typeof relConfig === "object" && relConfig !== null;
      const nestedInclude = isObj ? (relConfig as any).include : undefined;
      const nestedSelect = isObj ? (relConfig as any).select : undefined;

      const relModel = S[rel.model];
      const selCols = nestedSelect
        ? buildSelectCols(rel.model, nestedSelect)
        : "*";

      if (rel.direction === "has") {
        // Target table has FK pointing to our PK
        const parentIds = [
          ...new Set(rows.map((r) => r[model.pk]).filter((v) => v != null)),
        ];
        if (parentIds.length === 0) {
          rows.forEach((r) => {
            r[relName] = rel.type === "one" ? null : [];
          });
          return;
        }

        const fkCol = relModel.fields[rel.fk];
        const ph = parentIds.map(() => "?").join(", ");
        const result = await execOne(
          `SELECT ${selCols} FROM ${relModel.table} WHERE ${fkCol} IN (${ph})`,
          parentIds,
        );
        const relatedRows = mapRows(rel.model, result.rows);

        if (nestedInclude)
          await resolveIncludes(rel.model, relatedRows, nestedInclude);

        for (const row of rows) {
          const pk = row[model.pk];
          if (rel.type === "one") {
            row[relName] = relatedRows.find((r) => r[rel.fk] === pk) || null;
          } else {
            row[relName] = relatedRows.filter((r) => r[rel.fk] === pk);
          }
        }
      } else {
        // 'belongs' — we have FK pointing to target's PK
        const fkValues = [
          ...new Set(rows.map((r) => r[rel.fk]).filter((v) => v != null)),
        ];
        if (fkValues.length === 0) {
          rows.forEach((r) => {
            r[relName] = rel.type === "one" ? null : [];
          });
          return;
        }

        const targetPkCol = relModel.fields[relModel.pk];
        const ph = fkValues.map(() => "?").join(", ");
        const result = await execOne(
          `SELECT ${selCols} FROM ${relModel.table} WHERE ${targetPkCol} IN (${ph})`,
          fkValues,
        );
        const relatedRows = mapRows(rel.model, result.rows);

        if (nestedInclude)
          await resolveIncludes(rel.model, relatedRows, nestedInclude);

        for (const row of rows) {
          const fk = row[rel.fk];
          if (rel.type === "one") {
            row[relName] =
              relatedRows.find((r) => r[relModel.pk] === fk) || null;
          } else {
            row[relName] = relatedRows.filter((r) => r[relModel.pk] === fk);
          }
        }
      }
    }),
  );
}

// ============================================================
// Model Client Factory
// ============================================================

function createModelClient(mn: string) {
  const model = S[mn];

  return {
    async findMany(args?: any) {
      const w = buildWhere(mn, args?.where);
      const sel = args?.select ? buildSelectCols(mn, args.select) : "*";
      const ord = buildOrderBy(mn, args?.orderBy);
      const lim = args?.take ? `LIMIT ${Number(args.take)}` : "";
      const wc = w.sql ? `WHERE ${w.sql}` : "";

      const result = await execOne(
        `SELECT ${sel} FROM ${model.table} ${wc} ${ord} ${lim}`.trim(),
        w.params,
      );
      const rows = mapRows(mn, result.rows);

      if (args?.include) await resolveIncludes(mn, rows, args.include);

      return rows;
    },

    async findUnique(args: any) {
      const w = buildWhere(mn, args.where);
      const sel = args?.select ? buildSelectCols(mn, args.select) : "*";
      const wc = w.sql ? `WHERE ${w.sql}` : "";

      const result = await execOne(
        `SELECT ${sel} FROM ${model.table} ${wc} LIMIT 1`,
        w.params,
      );
      const rows = mapRows(mn, result.rows);
      if (rows.length === 0) return null;

      if (args?.include) await resolveIncludes(mn, rows, args.include);

      return rows[0];
    },

    async findFirst(args?: any) {
      const a = args || {};
      const w = buildWhere(mn, a.where);
      const sel = a.select ? buildSelectCols(mn, a.select) : "*";
      const ord = buildOrderBy(mn, a.orderBy);
      const wc = w.sql ? `WHERE ${w.sql}` : "";

      const result = await execOne(
        `SELECT ${sel} FROM ${model.table} ${wc} ${ord} LIMIT 1`,
        w.params,
      );
      const rows = mapRows(mn, result.rows);
      if (rows.length === 0) return null;

      if (a.include) await resolveIncludes(mn, rows, a.include);

      return rows[0];
    },

    async count(args?: any) {
      const w = buildWhere(mn, args?.where);
      const wc = w.sql ? `WHERE ${w.sql}` : "";

      const result = await execOne(
        `SELECT COUNT(*) as cnt FROM ${model.table} ${wc}`,
        w.params,
      );
      return Number(result.rows[0]?.cnt ?? 0);
    },

    async create(args: any) {
      const { columns, values } = buildInsert(mn, args.data);
      if (columns.length === 0) throw new Error("No data to insert");

      const ph = columns.map(() => "?").join(", ");
      const result = await execOne(
        `INSERT INTO ${model.table} (${columns.join(", ")}) VALUES (${ph})`,
        values,
      );

      // Fetch created row
      const pkCol = model.fields[model.pk];
      const fetchId = result.insertId || args.data[model.pk];
      const fetchResult = await execOne(
        `SELECT * FROM ${model.table} WHERE ${pkCol} = ? LIMIT 1`,
        [fetchId],
      );
      return mapRow(mn, fetchResult.rows[0]);
    },

    async update(args: any) {
      const w = buildWhere(mn, args.where);
      const { sets, values } = buildUpdate(mn, args.data);

      // Auto-set updatedAt
      if (model.fields.updatedAt && !args.data.updatedAt) {
        sets.push(`${model.fields.updatedAt} = ?`);
        values.push(new Date().toISOString().slice(0, 19).replace("T", " "));
      }

      if (sets.length === 0) throw new Error("No data to update");

      const wc = w.sql ? `WHERE ${w.sql}` : "";
      await execOne(`UPDATE ${model.table} SET ${sets.join(", ")} ${wc}`, [
        ...values,
        ...w.params,
      ]);

      // Fetch updated row
      const fetchResult = await execOne(
        `SELECT * FROM ${model.table} ${wc} LIMIT 1`,
        w.params,
      );
      return mapRow(mn, fetchResult.rows[0]);
    },

    async upsert(args: any) {
      const { columns, values: createVals } = buildInsert(mn, args.create);
      const { sets, values: updateVals } = buildUpdate(mn, args.update);

      // Auto-set updatedAt on update
      if (model.fields.updatedAt && !args.update.updatedAt) {
        sets.push(`${model.fields.updatedAt} = ?`);
        updateVals.push(
          new Date().toISOString().slice(0, 19).replace("T", " "),
        );
      }

      const ph = columns.map(() => "?").join(", ");
      const sql = `INSERT INTO ${model.table} (${columns.join(", ")}) VALUES (${ph}) ON DUPLICATE KEY UPDATE ${sets.join(", ")}`;

      await execOne(sql, [...createVals, ...updateVals]);

      // Fetch the row
      const w = buildWhere(mn, args.where);
      const wc = w.sql ? `WHERE ${w.sql}` : "";
      const fetchResult = await execOne(
        `SELECT * FROM ${model.table} ${wc} LIMIT 1`,
        w.params,
      );
      return mapRow(mn, fetchResult.rows[0]);
    },

    async delete(args: any) {
      const w = buildWhere(mn, args.where);
      const wc = w.sql ? `WHERE ${w.sql}` : "";

      // Fetch before delete
      const fetchResult = await execOne(
        `SELECT * FROM ${model.table} ${wc} LIMIT 1`,
        w.params,
      );
      const row = mapRow(mn, fetchResult.rows[0]);

      await execOne(`DELETE FROM ${model.table} ${wc}`, w.params);
      return row;
    },

    async deleteMany(args?: any) {
      const w = buildWhere(mn, args?.where);
      const wc = w.sql ? `WHERE ${w.sql}` : "";

      const result = await execOne(
        `DELETE FROM ${model.table} ${wc}`,
        w.params,
      );
      return { count: result.affectedRows };
    },
  };
}

// ============================================================
// Export: Prisma-compatible db object
// ============================================================

export function createProxyClient() {
  return {
    application: createModelClient("application"),
    admin: createModelClient("admin"),
    adminSetting: createModelClient("adminSetting"),
    adminApplicationVisibility: createModelClient("adminApplicationVisibility"),
    category: createModelClient("category"),
    applicationCategory: createModelClient("applicationCategory"),
    castingEmailDeliveryStatus: createModelClient("castingEmailDeliveryStatus"),
    consentRecord: createModelClient("consentRecord"),
    consentRequest: createModelClient("consentRequest"),
    episode: createModelClient("episode"),
    episodeMember: createModelClient("episodeMember"),
    filmingCalendar: createModelClient("filmingCalendar"),
  };
}
