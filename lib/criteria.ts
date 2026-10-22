import { db } from "./db";
import { DEFAULT_CRITERIA } from "./constants";

export async function getActiveCriteria() {
  const c = await db.criteria.findFirst({ where: { active: true }, orderBy: { createdAt: "desc" } });
  return c ?? { id: null as string | null, body: DEFAULT_CRITERIA };
}
