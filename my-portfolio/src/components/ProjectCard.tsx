import { useState } from "react"
import { ExternalLink, Github, Maximize2 } from "lucide-react"
import { getYouTubeThumbnailUrl, getTechIcon } from "../data/projects"
import { trackProjectLinkClick, trackIframeExpand } from "../utils/analytics"
import LiveSiteModal from "./LiveSiteModal"
import type { Project } from "../data/projects"

interface ProjectCardProps {
  project: Project
  isFiltered?: boolean
}

function ProjectCard({ project, isFiltered = false }: ProjectCardProps) {
  const [thumbnailError, setThumbnailError] = useState(false)
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false)

  // The poster click opens the live site in a modal only when the project
  // opted in (liveEmbeddable, see data/projects.ts) and has a poster to
  // show (video thumbnail or screenshot). The third-party iframe is never
  // mounted — nor its JS bundle fetched — unless the visitor clicks.
  const canOpenLiveSite = Boolean(
    project.liveEmbeddable && project.liveUrl && (project.videoUrl || project.screenshotUrl)
  )
  const isScreenshotCard = !project.videoUrl && Boolean(project.screenshotUrl)

  const posterUrl = project.videoUrl
    ? getYouTubeThumbnailUrl(project.videoUrl, thumbnailError ? "hqdefault" : "maxresdefault")
    : project.screenshotUrl ?? null

  const handlePosterClick = () => {
    trackIframeExpand(project.title)
    setIsLiveModalOpen(true)
  }

  const handleThumbnailError = () => {
    setThumbnailError(true)
  }

  const handleLinkClick = (linkType: "github" | "live") => {
    trackProjectLinkClick(project.title, linkType)
  }

  const posterAlt = isScreenshotCard
    ? `${project.title} screenshot`
    : `${project.title} video thumbnail`

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isFiltered ? "opacity-40" : "opacity-100"
      }`}
      aria-label={`Project: ${project.title}`}
    >
      {/* Poster Section */}
      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-zinc-900">
        {canOpenLiveSite && posterUrl && (
          <button
            type="button"
            onClick={handlePosterClick}
            aria-label={`Open ${project.title} live site`}
            className="relative block w-full h-full cursor-pointer group"
          >
            <img
              src={posterUrl}
              alt={posterAlt}
              className="w-full h-full object-cover"
              onError={project.videoUrl ? handleThumbnailError : undefined}
              loading="lazy"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <span className="w-16 h-16 rounded-full bg-cyan-400/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Maximize2 className="w-7 h-7 text-cyan-400" />
              </span>
            </span>
          </button>
        )}
        {!canOpenLiveSite && posterUrl && (
          <img
            src={posterUrl}
            alt={posterAlt}
            className="w-full h-full object-cover"
            onError={project.videoUrl ? handleThumbnailError : undefined}
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
      {canOpenLiveSite && project.liveUrl && (
        <LiveSiteModal
          isOpen={isLiveModalOpen}
          onClose={() => setIsLiveModalOpen(false)}
          title={project.title}
          url={project.liveUrl}
        />
      )}
    </div>
  )
}

export default ProjectCard
