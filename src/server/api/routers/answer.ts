import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    assessor_rating: z.string().optional(),
    assessor_explanation: z.string().optional(),
    assessor_evidence: z.string().optional(),
    consensus_rating: z.string().optional(),
    consensus_explanation: z.string().optional(),
    consensus_evidence: z.string().optional(),
    oversight_concurrence: z.string().optional(),
    oversight_explanation: z.string().optional(),
    oversight_evidence: z.string().optional(),
    client_concurrence: z.string().optional(),
    client_explanation: z.string().optional(),
    client_evidence: z.string().optional(),
    user_id: z.number().optional(),
    assessment_question_id: z.number(),
})

export const answerRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.answer.create({
                data: {
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
                    assessment_question_id: input.assessment_question_id,
                    updated_by: '',
                    created_by: '',
                },
            })
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.answer.update({
                where: { id: input.id },
                data: {
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
                    assessment_question_id: input.assessment_question_id,
                    updated_at: new Date(),
                    updated_by: '',
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
