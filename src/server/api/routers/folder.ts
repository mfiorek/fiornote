import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { folders } from "~/server/db/schema";

export const folderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        parentFolderId: z.string().nullable(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(folders).values({
        userId: ctx.session.user.id,
        parentFolderId: input.parentFolderId,
        name: input.name,
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.folders.findMany({
      where: eq(folders.userId, ctx.session.user.id),
    });
  }),
});
