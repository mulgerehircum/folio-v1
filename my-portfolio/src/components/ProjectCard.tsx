import { useState, useEffect } from "react"
import { useInView } from "../hooks/useInView"
import { ExternalLink, Github, Maximize2, Play } from "lucide-react"
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl, getTechIcon } from "../data/projects"
import { trackCardVariantView, trackProjectLinkClick } from "../utils/analytics"
import { getExperimentVariant } from "../utils/experiment"
import LiveSiteModal from "./LiveSiteModal"
import ScreenshotLightbox from "./ScreenshotLightbox"
import type { Project } from "../data/projects"

interface ProjectCardProps {
  project: Project
  isFiltered?: boolean
}

function ProjectCard({ project, isFiltered = false }: ProjectCardProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1, once: false })

  // One variant per page load (see utils/experiment.ts), not per card —
  // read once on mount and cached, not re-rolled on re-render. Works for
  // both video projects (variant flips video <-> iframe) and screenshot-only
  // projects (variant flips a zoomed screenshot <-> iframe, see
  // isScreenshotCard below) as long as the project opted in and has a live URL.
  const isExperimentEligible = Boolean(
    project.liveEmbeddable && project.liveUrl && (project.videoUrl || project.screenshotUrl)
  )
  const [variant] = useState(() => (isExperimentEligible ? getExperimentVariant() : "video"))
  const useIframeTreatment = isExperimentEligible && variant === "iframe"
  const isScreenshotCard = !project.videoUrl && Boolean(project.screenshotUrl)

  useEffect(() => {
    if (isExperimentEligible) {
      trackCardVariantView(project.title, variant)
    }
    // Fires once per mount — project.title/variant/isExperimentEligible don't
    // change after a card's initial assignment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const embedUrl = project.videoUrl ? getYouTubeEmbedUrl(project.videoUrl) : null
  const thumbnailUrl = project.videoUrl ? getYouTubeThumbnailUrl(project.videoUrl, thumbnailError ? "hqdefault" : "maxresdefault") : null

  // Auto-load the video when the card enters viewport (after a small delay).
  // The live-site iframe never auto-loads — click-to-load only, so an
  // embedded third-party app is never mounted (and its JS bundle never
  // fetched) unless the visitor actually asks for it.
  useEffect(() => {
    if (inView && !videoLoaded && thumbnailUrl && !useIframeTreatment) {
      const timer = setTimeout(() => {
        setVideoLoaded(true)
      }, 500) // Small delay to allow thumbnail to show first
      return () => clearTimeout(timer)
    }
  }, [inView, videoLoaded, thumbnailUrl, useIframeTreatment])

  const shouldLoadVideo = videoLoaded

  // Live site opens in a modal (a card-sized frame isn't a usable viewport
  // for most of these projects) rather than swapping the thumbnail out
  // inline the way the video embed does.
  const handleThumbnailClick = () => {
    if (useIframeTreatment) {
      setIsLiveModalOpen(true)
      return
    }
    setVideoLoaded(true)
  }

  const handleThumbnailError = () => {
    setThumbnailError(true)
  }

  // Screenshot-only cards have no video to fall back on, so the non-iframe
  // variant opens a zoomed lightbox instead — keeps "clicking always does
  // something" true for both variants here too, same as the video cards.
  const handleScreenshotClick = () => {
    if (useIframeTreatment) {
      setIsLiveModalOpen(true)
      return
    }
    setIsLightboxOpen(true)
  }

  const handleLinkClick = (linkType: "github" | "live") => {
    trackProjectLinkClick(project.title, linkType, isExperimentEligible ? variant : undefined)
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out ${
        isFiltered ? "opacity-40" : "opacity-100"
      }`}
      aria-label={`Project: ${project.title}`}
    >
      {/* Video / Screenshot / Live-site Section */}
      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-zinc-900">
        {isScreenshotCard && !isExperimentEligible && (
          <img
            src={project.screenshotUrl}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {/* Same rule as the video thumbnail below: identical pre-click UI
            for both variants — only what the click opens differs (a zoomed
            screenshot vs the live-site modal). */}
        {isScreenshotCard && isExperimentEligible && (
          <div className="relative w-full h-full cursor-pointer group" onClick={handleScreenshotClick}>
            <img
              src={project.screenshotUrl}
              alt={`${project.title} screenshot`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-cyan-400/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Maximize2 className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
          </div>
        )}
        {/* Same placeholder regardless of variant — only what a click does
            differs (open the live-site modal vs load the YouTube embed
            inline), never the pre-click UI, so the treatment being tested is
            purely "what happens," not "does this look different up front."
            For the iframe variant, videoLoaded never becomes true (see
            handleThumbnailClick/the auto-load effect above), so this
            placeholder never goes away — the live site opens in
            LiveSiteModal below instead of replacing it. */}
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
        {shouldLoadVideo && !useIframeTreatment && embedUrl && (
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
      {useIframeTreatment && project.liveUrl && (
        <LiveSiteModal
          isOpen={isLiveModalOpen}
          onClose={() => setIsLiveModalOpen(false)}
          title={project.title}
          url={project.liveUrl}
        />
      )}
      {isScreenshotCard && isExperimentEligible && project.screenshotUrl && (
        <ScreenshotLightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          title={project.title}
          imageUrl={project.screenshotUrl}
        />
      )}
    </div>
  )
}

export default ProjectCard

