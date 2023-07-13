import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    type: z.string(),
    name: z.string(),
    site_id: z.number().optional(),
})

export const filterRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.filter.create({
                data: {
                    type: input.type,
                    name: input.name,
                    site_id: input.site_id,
                    created_by: '',
                    updated_by: '',
                }
            });
        }),
    update: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.filter.update({
                where: { id: input.id },
                data: {
                    type: input.type,
                    name: input.name,
                    site_id: input.site_id,
                    created_by: '',
                    updated_by: '',
                }
            });
        }),
    getAllBusinessTypes: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.filter.findMany({
                where: { type: 'business-type' }
            });
        }),
    getAllManufacturingTypes: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.filter.findMany({
                where: { type: 'manufacturing-type' }
            });
        }),
    getAllSiteSpecific: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.filter.findMany({
                where: { type: 'site-specific' }
            });
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.filter.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.filter.findMany();
        }),
});
