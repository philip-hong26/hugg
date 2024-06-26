import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { workflows } from "@/server/db/schema";

export const workflowsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(
      z.object({ candidateEmail: z.string().min(1), name: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(workflows).values({
        candidateEmail: input.candidateEmail,
        currentStep: 1,
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.workflows.findFirst({
      orderBy: (workflows, { desc }) => [desc(workflows.createdAt)],
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.workflows.findMany();
  }),
});
