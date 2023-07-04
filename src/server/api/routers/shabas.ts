import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const shabasRouter = createTRPCRouter({
    getAdminDashboardObjectTotals: protectedProcedure
        .input(z.boolean().optional())
        .query(async ({ ctx }) => {
            const clientCount = await ctx.prisma.client.count();
            const siteCount = await ctx.prisma.site.count();
            const pocCount = await ctx.prisma.poc.count();
            const engagementCount = await ctx.prisma.engagement.count();
            const assessmentCount = await ctx.prisma.assessment.count();
            const questionCount = await ctx.prisma.question.count();
            
            return {
                clients: clientCount,
                sites: siteCount,
                pocs: pocCount,
                engagements: engagementCount,
                assessments: assessmentCount,
                questions: questionCount,
            };
        }),
});
