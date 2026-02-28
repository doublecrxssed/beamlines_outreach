import { compileMDX } from 'next-mdx-remote/rsc'
import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import { RevealText } from '@/components/client/RevealText'
import { MathGate } from '@/components/client/MathGate'
import { StandardModelSorter } from '@/components/client/StandardModelSorter'
import { Cyclotron } from '@/components/client/Cyclotron'
import { InductionCoil } from '@/components/client/InductionCoil'
import { QuantumCoin } from '@/components/client/QuantumCoin'
import { RelativisticTrain } from '@/components/client/RelativisticTrain'
import { CheckpointQuiz } from '@/components/client/CheckpointQuiz'
import { NeutrinoTrain } from '@/components/client/NeutrinoTrain'
import { QuarkConfinement } from '@/components/client/QuarkConfinement'
import { UnificationEpoch } from '@/components/client/UnificationEpoch'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export default async function TopicPage({ params }: { params: Promise<{ lang: string, topic: string }> }) {
    const { lang, topic } = await params

    let content: React.ReactNode;

    try {
        const filePath = path.join(process.cwd(), 'src/content', lang, `${topic}.mdx`)
        const fileContent = await fs.readFile(filePath, 'utf8')

        const compiled = await compileMDX({
            source: fileContent,
            components: {
                // Automatically wrap every standard markdown paragraph in a scroll-reveal animation
                p: (props: React.PropsWithChildren) => <RevealText>{props.children}</RevealText>,
                MathGate: MathGate,
                StandardModelSorter: (props: React.PropsWithChildren & { lang?: string }) => <StandardModelSorter lang={lang} {...props} />,
                Cyclotron: (props: React.PropsWithChildren & { lang?: string }) => <Cyclotron lang={lang} {...props} />,
                InductionCoil: (props: React.PropsWithChildren & { lang?: string }) => <InductionCoil lang={lang} {...props} />,
                QuantumCoin: (props: React.PropsWithChildren & { lang?: string }) => <QuantumCoin lang={lang} {...props} />,
                RelativisticTrain: (props: React.PropsWithChildren & { lang?: string }) => <RelativisticTrain lang={lang} {...props} />,
                NeutrinoTrain: (props: React.PropsWithChildren & { lang?: string }) => <NeutrinoTrain lang={lang} {...props} />,
                QuarkConfinement: (props: React.PropsWithChildren & { lang?: string }) => <QuarkConfinement lang={lang} {...props} />,
                UnificationEpoch: (props: React.PropsWithChildren & { lang?: string }) => <UnificationEpoch lang={lang} {...props} />,
                CheckpointQuiz: (props: React.ComponentProps<typeof CheckpointQuiz>) => <CheckpointQuiz lang={lang} {...props} />
            },
            options: {
                parseFrontmatter: true,
                mdxOptions: {
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                }
            }
        })
        content = compiled.content
    } catch (err) {
        // Fallback to Next.js strict notFound routing if the topic doesn't exist
        console.error('Failed to load MDX content:', err)
        notFound()
    }

    return (
        <main className="container mx-auto px-6 py-24 max-w-3xl">
            <article className="prose prose-invert prose-lg prose-blue max-w-none">
                {content}
            </article>
        </main>
    )
}
