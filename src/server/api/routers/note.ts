import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { notes } from "~/server/db/schema";

export const noteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        parentFolderId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(notes).values({
        id: input.id,
        userId: ctx.session.user.id,
        parentFolderId: input.parentFolderId,
        name: `New note ${new Date().toLocaleDateString()}`,
        textJson: JSON.stringify({}),
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.notes.findMany({
      where: eq(notes.userId, ctx.session.user.id),
    });
  }),
});
