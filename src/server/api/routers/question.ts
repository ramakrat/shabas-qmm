import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const inputType = z.object({
    id: z.number().optional(),
    active: z.boolean(),
    number: z.string(),
    question: z.string(),
    pillar: z.string(),
    practice_area: z.string(),
    topic_area: z.string(),
    hint: z.string(),
    priority: z.string(),
})

export const questionRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(async ({ input, ctx }) => {
            try {
                const created = ctx.prisma.question.create({
                    data: {
                        active: input.active,
                        number: input.number,
                        question: input.question,
                        pillar: input.pillar,
                        practice_area: input.practice_area,
                        topic_area: input.topic_area,
                        hint: input.hint,
                        priority: input.priority,
                        created_by: '',
                        updated_by: '',
                    }
                })
                return created;
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    // The .code property can be accessed in a type-safe manner
                    if (e.code === 'P2002') {
                        console.log(
                            'There is a unique constraint violation.'
                        )
                    }
                }
                throw e;
            }
        }),
    update: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.question.update({
                where: { id: input.id },
                data: {
                    active: input.active,
                    number: input.number,
                    question: input.question,
                    pillar: input.pillar,
                    practice_area: input.practice_area,
                    topic_area: input.topic_area,
                    hint: input.hint,
                    priority: input.priority,
                    updated_at: new Date(),
                    updated_by: '',
                }
            })
        }),
    active: protectedProcedure
        .input(z.object({
            id: z.number(),
            active: z.boolean(),
        }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.question.update({
                where: { id: input.id },
                data: {
                    active: input.active,
                    updated_at: new Date(),
                    updated_by: '',
                }
            })
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.question.findUnique({
                where: { id: input.id }
            });
        }),
    getAllActiveInclude: protectedProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.question.findMany({
                where: { active: true },
                include: {
                    ratings: {
                        include: {
                            filter: true
                        }
                    }
                }
            });
        }),
    getAll: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.question.findMany();
        }),
    getTotalCount: protectedProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.question.count();
        }),
});
