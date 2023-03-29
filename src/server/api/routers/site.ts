import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


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
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.site.upsert({
                where: { id: input.id },
                update: {
                    description: input.description,
                    name: input.name,
                    street_address: input.street_address,
                    city: input.city,
                    state: input.state,
                    country: input.country,
                    zip_code: input.zip_code,
                    last_updated: new Date(),
                    last_updated_by: '',
                    client_id: input.client_id,
                },
                create: {
                    description: input.description,
                    name: input.name,
                    street_address: input.street_address,
                    city: input.city,
                    state: input.state,
                    country: input.country,
                    zip_code: input.zip_code,
                    created_by: '',
                    last_updated_by: '',
                    client_id: input.client_id,
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.site.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.site.findMany();
        }),
});
