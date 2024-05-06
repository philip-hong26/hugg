// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  int,
  mysqlTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `hugg_${name}`);

const commons = {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
};

export const workflows = createTable(
  "workflow",
  {
    ...commons,
    candidateEmail: varchar("candidate_email", { length: 120 }).notNull(),
    currentStep: int("current_step").notNull(),
    name: varchar("name", { length: 256 }),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const worflowSteps = createTable(
  "workflow_steps",
  {
    ...commons,
    workflowId: bigint("workflow_id", { mode: "number" }).notNull(),
    step: varchar("step", { length: 256 }).notNull(),
  },
  (example) => ({
    workflowIdIndex: index("workflow_id_idx").on(example.workflowId),
    stepIndex: index("step_idx").on(example.step),
  }),
);

export type WorkflowCreate = InferInsertModel<typeof workflows>;
export type WorkflowSelect = InferSelectModel<typeof workflows>;
export type WorkflowStepCreate = InferInsertModel<typeof worflowSteps>;
export type WorkflowStepSelect = InferSelectModel<typeof worflowSteps>;
