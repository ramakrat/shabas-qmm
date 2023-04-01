import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    type: z.string(),
    name: z.string(),
})

export const filterRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.filter.create({
                data: {
                    type: input.type,
                    name: input.name,
                    created_by: '',
                    updated_by: '',
                }
            });
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.filter.update({
                where: { id: input.id },
                data: {
                    type: input.type,
                    name: input.name,
                    created_by: '',
                    updated_by: '',
                }
            });
        }),
    getAllIndustry: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.filter.findMany({
                where: { type: 'industry' }
            });
        }),
    getAllApiSegment: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.filter.findMany({
                where: { type: 'api-segment' }
            });
        }),
    getAllSiteSpecific: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.filter.findMany({
                where: { type: 'site-specific' }
            });
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.filter.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.filter.findMany();
        }),
});
