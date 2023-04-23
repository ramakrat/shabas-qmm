import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    field: z.string(),
    former_value: z.string(),
    new_value: z.string(),
})

export const changelogRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.changelog.create({
                data: {
                    field: input.field,
                    former_value: input.former_value,
                    new_value: input.new_value,
                    updated_by: '',
                }
            })
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.changelog.update({
                where: { id: input.id },
                data: {
                    field: input.field,
                    former_value: input.former_value,
                    new_value: input.new_value,
                    updated_at: new Date(),
                    updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.changelog.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.changelog.findMany();
        }),
});
