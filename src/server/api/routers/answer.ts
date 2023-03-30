import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    assessor_rating: z.string(),
    assessor_explanation: z.string(),
    assessor_evidence: z.string(),
    consensus_rating: z.string(),
    consensus_explanation: z.string(),
    consensus_evidence: z.number(),
    oversight_concurrence: z.string(),
    oversight_explanation: z.string(),
    oversight_evidence: z.number(),
    client_concurrence: z.string(),
    client_explanation: z.string(),
    client_evidence: z.number(),
    user_id: z.number(),
    question_id: z.number(),
})

export const answerRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.answer.upsert({
                where: { id: input.id },
                update: {
                    assessor_rating: input.assessor_rating,
                    assessor_explanation: input.assessor_explanation,
                    assessor_evidence: input.assessor_evidence,
                    consensus_rating: input.consensus_rating,
                    consensus_explanation: input.consensus_explanation,
                    consensus_evidence: input.consensus_evidence,
                    oversight_concurrence: input.oversight_concurrence,
                    oversight_explanation: input.oversight_explanation,
                    oversight_evidence: input.oversight_evidence,
                    client_concurrence: input.client_concurrence,
                    client_explanation: input.client_explanation,
                    client_evidence: input.client_evidence,
                    user_id: input.user_id,
                    question_id: input.question_id,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    assessor_rating: input.assessor_rating,
                    assessor_explanation: input.assessor_explanation,
                    assessor_evidence: input.assessor_evidence,
                    consensus_rating: input.consensus_rating,
                    consensus_explanation: input.consensus_explanation,
                    consensus_evidence: input.consensus_evidence,
                    oversight_concurrence: input.oversight_concurrence,
                    oversight_explanation: input.oversight_explanation,
                    oversight_evidence: input.oversight_evidence,
                    client_concurrence: input.client_concurrence,
                    client_explanation: input.client_explanation,
                    client_evidence: input.client_evidence,
                    user_id: input.user_id,
                    question_id: input.question_id,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.answer.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.answer.findMany();
        }),
});
