import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    assessor_rating: z.string().optional(),
    assessor_rationale: z.string().optional(),
    assessor_suggestion: z.string().optional(),
    assessor_notes: z.string().optional(),
    consensus_rating: z.string().optional(),
    consensus_rationale: z.string().optional(),
    consensus_notes: z.string().optional(),
    oversight_concurrence: z.string().optional(),
    oversight_rationale: z.string().optional(),
    oversight_notes: z.string().optional(),
    client_concurrence: z.string().optional(),
    client_rationale: z.string().optional(),
    client_notes: z.string().optional(),
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
                    assessor_rationale: input.assessor_rationale,
                    assessor_suggestion: input.assessor_suggestion,
                    assessor_notes: input.assessor_notes,
                    consensus_rating: input.consensus_rating,
                    consensus_rationale: input.consensus_rationale,
                    consensus_notes: input.consensus_notes,
                    oversight_concurrence: input.oversight_concurrence,
                    oversight_rationale: input.oversight_rationale,
                    oversight_notes: input.oversight_notes,
                    client_concurrence: input.client_concurrence,
                    client_rationale: input.client_rationale,
                    client_notes: input.client_notes,
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
                    assessor_rationale: input.assessor_rationale,
                    assessor_suggestion: input.assessor_suggestion,
                    assessor_notes: input.assessor_notes,
                    consensus_rating: input.consensus_rating,
                    consensus_rationale: input.consensus_rationale,
                    consensus_notes: input.consensus_notes,
                    oversight_concurrence: input.oversight_concurrence,
                    oversight_rationale: input.oversight_rationale,
                    oversight_notes: input.oversight_notes,
                    client_concurrence: input.client_concurrence,
                    client_rationale: input.client_rationale,
                    client_notes: input.client_notes,
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
