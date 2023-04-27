import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    user_id: z.number(),
    assessment_id: z.number(),
})

export const assessmentUserRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentUser.upsert({
                where: { id: input.id },
                update: {
                    user_id: input.user_id,
                    assessment_id: input.assessment_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
                create: {
                    user_id: input.user_id,
                    assessment_id: input.assessment_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentUser.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessmentUser .findMany();
        }),
});
