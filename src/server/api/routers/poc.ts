import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    first_name: z.string(),
    last_name: z.string(),
    title: z.string(),
    mobile_phone: z.string(),
    work_phone: z.string(),
    email: z.string(),
    user_id: z.number().optional(),
    client_id: z.number().optional(),
    engagement_id: z.number().optional(),
    site_id: z.number().optional(),
})

export const pocRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.poc.create({
                data: {
                    first_name: input.first_name,
                    last_name: input.last_name,
                    title: input.title,
                    mobile_phone: input.mobile_phone,
                    work_phone: input.work_phone,
                    email: input.email,
                    user_id: input.user_id,
                    client_id: input.client_id,
                    engagement_id: input.engagement_id,
                    site_id: input.site_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    update: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.poc.update({
                where: { id: input.id },
                data: {
                    first_name: input.first_name,
                    last_name: input.last_name,
                    title: input.title,
                    mobile_phone: input.mobile_phone,
                    work_phone: input.work_phone,
                    email: input.email,
                    user_id: input.user_id,
                    client_id: input.client_id,
                    engagement_id: input.engagement_id,
                    site_id: input.site_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            });
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.poc.findUnique({
                where: { id: input.id }
            });
        }),
    getAllInclude: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.poc.findMany({
                include: {
                    client: true,
                    engagement: true,
                    site: true,
                    user: true,
                }
            });
        }),
    getAll: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.poc.findMany();
        }),
    getAllClient: protectedProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.poc.findMany({
                where: {
                    NOT: [
                        {
                            client_id: null
                        }
                    ]
                }
            });
        }),
    getTotalCount: protectedProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.poc.count();
        }),
});
