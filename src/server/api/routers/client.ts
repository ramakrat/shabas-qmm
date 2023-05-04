import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    name: z.string(),
    street_address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zip_code: z.string(),
    description: z.string(),
})

export const clientRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.client.create({
                data: {
                    name: input.name,
                    street_address: input.street_address,
                    city: input.city,
                    state: input.state,
                    country: input.country,
                    zip_code: input.zip_code,
                    description: input.description,
                    created_by: '',
                    updated_by: '',
                }
            });
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.client.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    street_address: input.street_address,
                    city: input.city,
                    state: input.state,
                    country: input.country,
                    zip_code: input.zip_code,
                    description: input.description,
                    updated_at: new Date(),
                    updated_by: '',
                },
            });
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.client.findUnique({
                where: { id: input.id }
            });
        }),
    getAllInclude: publicProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.client.findMany({
                include: {
                    sites: true
                }
            });
        }),
    getAll: publicProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.client.findMany();
        }),
    getTotalCount: publicProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.client.count();
        }),
});
