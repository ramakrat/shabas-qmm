import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    description: z.string(),
    name: z.string(),
    street_address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zip_code: z.string(),
    client_id: z.number(),
})

export const siteRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.site.create({
                data: {
                    name: input.name,
                    street_address: input.street_address,
                    city: input.city,
                    state: input.state,
                    country: input.country,
                    zip_code: input.zip_code,
                    description: input.description,
                    client_id: input.client_id,
                    created_by: '',
                    updated_by: '',
                }
            });
        }),
    update: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.site.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    street_address: input.street_address,
                    city: input.city,
                    state: input.state,
                    country: input.country,
                    zip_code: input.zip_code,
                    description: input.description,
                    client_id: input.client_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            });
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.site.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: protectedProcedure
        .input(z.boolean().optional())
        .query(async ({ ctx }) => {
            return await ctx.prisma.site.findMany({
                include: {
                    client: true
                }
            });
        }),
    getAllNonFilter: protectedProcedure
        .input(z.boolean())
        .query(async ({ ctx }) => {
            return await ctx.prisma.site.findMany({
                include: {
                    client: true
                },
                where: {
                    filter: null
                }
            });
        }),
    getTotalCount: protectedProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.site.count();
        }),
});
