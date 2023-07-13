import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


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
    create: protectedProcedure
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
    update: protectedProcedure
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
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.client.findUnique({
                where: { id: input.id }
            });
        }),
    getAllInclude: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.client.findMany({
                include: {
                    sites: true
                }
            });
        }),
    getAll: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.client.findMany();
        }),
    getTotalCount: protectedProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.client.count();
        }),
    deleteById: protectedProcedure
        .input(z.number())
        .mutation(({ input, ctx }) => {
            return ctx.prisma.client.delete({
                where: {
                    id: input
                }
            });
        }),
});
