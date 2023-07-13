import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    first_name: z.string(),
    last_name: z.string(),
    mobile_phone: z.string(),
    email: z.string(),
    question_id: z.number(),
})

export const userRouter = createTRPCRouter({
    // create: protectedProcedure
    //     .input(inputType)
    //     .mutation(({ input, ctx }) => {
    //         return ctx.prisma.user.create({
    //             data: {
    //                 first_name: input.first_name,
    //                 last_name: input.last_name,
    //                 mobile_phone: input.mobile_phone,
    //                 email: input.email,
    //                 question_id: input.question_id,
    //                 created_by: '',
    //                 updated_by: '',
    //             }
    //         })
    //     }),
    // update: protectedProcedure
    //     .input(inputType)
    //     .mutation(({ input, ctx }) => {
    //         return ctx.prisma.user.update({
    //             where: { id: input.id },
    //             data: {
    //                 first_name: input.first_name,
    //                 last_name: input.last_name,
    //                 mobile_phone: input.mobile_phone,
    //                 email: input.email,
    //                 question_id: input.question_id,
    //                 updated_at: new Date(),
    //                 updated_by: '',
    //             },
    //         })
    //     }),
    getAllByRole: protectedProcedure
        .input(z.string())
        .query(({ input, ctx }) => {
            return ctx.prisma.user.findMany({
                where: {
                    role: input as any
                }
            });
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.user.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.user.findMany();
        }),
});
