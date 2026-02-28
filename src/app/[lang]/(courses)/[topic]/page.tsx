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
import { HiggsBazaar } from '@/components/client/HiggsBazaar'
import { GravityCarousel } from '@/components/client/GravityCarousel'
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
                h1: (props: React.PropsWithChildren) => <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet mb-8 pb-6 border-b border-white/10 leading-tight">{props.children}</h1>,
                h2: (props: React.PropsWithChildren) => <h2 className="text-3xl font-display font-bold text-white mt-16 mb-6 tracking-tight">{props.children}</h2>,
                h3: (props: React.PropsWithChildren) => <h3 className="text-2xl font-display font-bold text-neon-cyan mt-12 mb-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">{props.children}</h3>,
                ul: (props: React.PropsWithChildren) => <ul className="list-disc pl-6 space-y-3 my-8 text-slate-300 text-lg leading-relaxed marker:text-neon-cyan">{props.children}</ul>,
                li: (props: React.PropsWithChildren) => <li className="pl-2">{props.children}</li>,
                strong: (props: React.PropsWithChildren) => <strong className="font-bold text-white drop-shadow-sm">{props.children}</strong>,
                blockquote: (props: React.PropsWithChildren) => <blockquote className="border-l-4 border-neon-violet pl-6 my-8 py-2 italic text-slate-400 bg-white/5 rounded-r-lg">{props.children}</blockquote>,
                MathGate: MathGate,
                Cyclotron: (props: React.PropsWithChildren & { lang?: string }) => <Cyclotron lang={lang} {...props} />,
                InductionCoil: (props: React.PropsWithChildren & { lang?: string }) => <InductionCoil lang={lang} {...props} />,
                HiggsBazaar: (props: React.PropsWithChildren & { lang?: string }) => <HiggsBazaar lang={lang} {...props} />,
                GravityCarousel: (props: React.PropsWithChildren & { lang?: string }) => <GravityCarousel lang={lang} {...props} />,
                StandardModelSorter: (props: React.PropsWithChildren & { lang?: string }) => <StandardModelSorter lang={lang} {...props} />,
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
