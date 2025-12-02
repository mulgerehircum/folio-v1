import { useState, useEffect } from "react"
import { useInView } from "../hooks/useInView"
import { ExternalLink, Github, Play } from "lucide-react"
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl, getTechIcon } from "../data/projects"
import { trackProjectLinkClick } from "../utils/analytics"
import type { Project } from "../data/projects"

interface ProjectCardProps {
  project: Project
  isFiltered?: boolean
}

function ProjectCard({ project, isFiltered = false }: ProjectCardProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1, once: false })

  const embedUrl = getYouTubeEmbedUrl(project.videoUrl)
  const thumbnailUrl = getYouTubeThumbnailUrl(project.videoUrl, thumbnailError ? "hqdefault" : "maxresdefault")

  // Auto-load video when card enters viewport (after a small delay)
  useEffect(() => {
    if (inView && !videoLoaded && thumbnailUrl) {
      const timer = setTimeout(() => {
        setVideoLoaded(true)
      }, 500) // Small delay to allow thumbnail to show first
      return () => clearTimeout(timer)
    }
  }, [inView, videoLoaded, thumbnailUrl])

  const shouldLoadVideo = videoLoaded

  const handleThumbnailClick = () => {
    setVideoLoaded(true)
  }

  const handleThumbnailError = () => {
    setThumbnailError(true)
  }

  const handleLinkClick = (linkType: "github" | "live") => {
    trackProjectLinkClick(project.title, linkType)
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out ${
        isFiltered ? "opacity-40" : "opacity-100"
      }`}
      aria-label={`Project: ${project.title}`}
    >
      {/* Video Section */}
      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-zinc-900">
        {!videoLoaded && thumbnailUrl && (
          <div className="relative w-full h-full cursor-pointer group" onClick={handleThumbnailClick}>
            <img
              src={thumbnailUrl}
              alt={`${project.title} video thumbnail`}
              className="w-full h-full object-cover"
              onError={handleThumbnailError}
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-cyan-400/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-cyan-400 ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        )}
        {shouldLoadVideo && embedUrl && (
          <iframe
            src={embedUrl}
            title={`${project.title} video`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 text-zinc-200">{project.title}</h3>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-3">
        {project.techStack.map((tech) => {
          const Icon = getTechIcon(tech)
          return (
            <div
              key={tech}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/50 border border-cyan-400/20"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-zinc-300">{tech}</span>
            </div>
          )
        })}
      </div>

      {/* Description */}
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">{project.description}</p>

      {/* Links */}
      <div className="flex items-center gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleLinkClick("github")}
            className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-cyan-400 transition-colors"
            aria-label={`View ${project.title} on GitHub`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleLinkClick("live")}
            className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-cyan-400 transition-colors"
            aria-label={`View live demo of ${project.title}`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Link</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectCard

