import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Using global to prevent multiple instances during hot reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(request: Request) {
    try {
        // Extract deviceId securely from proxy middleware cookies
        const cookieHeader = request.headers.get('cookie') || ''
        const match = cookieHeader.match(/deviceId=([^;]+)/)
        const deviceId = match ? match[1] : null

        if (!deviceId) return NextResponse.json({ error: 'Unauthorized device' }, { status: 401 })

        const body = await request.json()
        const { topicId, mathLevelUsed, interactionCount = 1 } = body

        // 1. Ensure user exists (frictionless auth)
        const user = await prisma.user.upsert({
            where: { deviceId },
            update: {},
            create: { deviceId }
        })

        // 2. Log interaction progress
        await prisma.progress.create({
            data: {
                userId: user.id,
                topicId: topicId || 'standard-model',
                mathLevelUsed: mathLevelUsed || 'no-math',
                interactions: interactionCount
            }
        })

        // 3. Calculate total interactions for this topic to return global progress
        const totalInteractions = await prisma.progress.aggregate({
            where: { userId: user.id, topicId: topicId || 'standard-model' },
            _sum: { interactions: true }
        })

        // Cap the assumed "100%" completion at 10 meaningful interactions for MVP gamification
        const targetInteractions = 10
        const current = totalInteractions._sum.interactions || 0
        const rawPercentage = (current / targetInteractions) * 100
        const safePercentage = Math.min(rawPercentage, 100)

        return NextResponse.json({
            success: true,
            progress: safePercentage,
            isComplete: safePercentage >= 100
        })

    } catch (error) {
        console.error('Progress API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
