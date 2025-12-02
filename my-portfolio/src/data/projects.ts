import type { IconType } from "react-icons"
import {
    SiReact,
    SiTypescript,
    SiJavascript,
    SiVuedotjs,
    SiNodedotjs,
    SiHtml5,
    SiCss3,
    SiTailwindcss,
    SiGit,
    SiGithub,
    SiGraphql,
    SiPostgresql,
    SiMongodb,
    SiExpress,
    SiNextdotjs,
    SiVite,
    SiWebpack,
    SiNpm,
    SiYarn,
    SiDocker,
    SiAmazon,
    SiVercel,
    SiNetlify,
    SiFirebase,
    SiSupabase,
} from "react-icons/si"
import { Code } from "lucide-react"

export interface Project {
    title: string
    description: string
    techStack: string[]
    videoUrl: string
    githubUrl?: string
    liveUrl?: string
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
            return match[1]
        }
    }

    return null
}

/**
 * Convert YouTube URL to embed URL with privacy mode
 */
export function getYouTubeEmbedUrl(videoUrl: string): string | null {
    const videoId = extractYouTubeVideoId(videoUrl)
    if (!videoId) return null

    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnailUrl(videoUrl: string, quality: "maxresdefault" | "hqdefault" = "maxresdefault"): string | null {
    const videoId = extractYouTubeVideoId(videoUrl)
    if (!videoId) return null

    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/**
 * Map tech names to official brand icons from react-icons
 */
export const techIconMap: Record<string, IconType> = {
    React: SiReact,
    "React.js": SiReact,
    TypeScript: SiTypescript,
    JavaScript: SiJavascript,
    Vue: SiVuedotjs,
    "Vue.js": SiVuedotjs,
    "Vue 3": SiVuedotjs,
    Node: SiNodedotjs,
    "Node.js": SiNodedotjs,
    HTML: SiHtml5,
    "HTML5": SiHtml5,
    CSS: SiCss3,
    "CSS3": SiCss3,
    Tailwind: SiTailwindcss,
    "Tailwind CSS": SiTailwindcss,
    Git: SiGit,
    GitHub: SiGithub,
    GraphQL: SiGraphql,
    PostgreSQL: SiPostgresql,
    MongoDB: SiMongodb,
    Express: SiExpress,
    "Express.js": SiExpress,
    Next: SiNextdotjs,
    "Next.js": SiNextdotjs,
    Vite: SiVite,
    Webpack: SiWebpack,
    npm: SiNpm,
    Yarn: SiYarn,
    Docker: SiDocker,
    AWS: SiAmazon,
    Vercel: SiVercel,
    Netlify: SiNetlify,
    Firebase: SiFirebase,
    Supabase: SiSupabase,
}

/**
 * Get icon for a tech name, with fallback to generic Code icon
 */
export function getTechIcon(tech: string): IconType {
    return techIconMap[tech] || Code
}

export const projects: Project[] = [
    {
        title: "Noire Winery Landing",
        description: "A landing page for a winery built with React, TypeScript, and Tailwind CSS.",
        techStack: ["React", "TypeScript", "Tailwind CSS"],
        videoUrl: "https://youtu.be/a_s6j_zu4IM",
        githubUrl: "https://github.com/mulgerehircum/winery-landing",
        liveUrl: "https://noire-winery-landing-v1.vercel.app/",
    },
]

