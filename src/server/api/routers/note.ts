import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { notes } from "~/server/db/schema";

export const noteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        parentFolderId: z.string().nullable(),
        name: z.string(),
        textJson: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(notes).values({
        userId: ctx.session.user.id,
        parentFolderId: input.parentFolderId,
        name: input.name,
        textJson: input.textJson,
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.notes.findMany({
      where: eq(notes.userId, ctx.session.user.id),
    });
  }),
});
