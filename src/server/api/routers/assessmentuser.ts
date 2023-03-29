import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    user_id: z.user_id(),
    assessment_id: z.assessment_id(),
})

export const assessmentUserRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentuser.upsert({
                where: { id: input.id },
                update: {
                    user_id: input.user_id,
                    assessment_id: input.assessment_id,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    user_id: input.user_id,
                    assessment_id: input.assessment_id,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentuser.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessmentuser.findMany();
        }),
});
