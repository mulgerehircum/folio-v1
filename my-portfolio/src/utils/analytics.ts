/**
 * Analytics utility functions. Events currently fire to BOTH Simple Analytics
 * and Lantern Analytics while the two run side by side.
 *
 * - Simple Analytics: `window.sa_event` (loaded via the script tag in
 *   index.html, with its own metadata collector).
 * - Lantern: `window.lantern.track` (loaded via /tracker.js, also in
 *   index.html). Lantern metadata is string/number/boolean only, so the
 *   wrappers below send curated metadata there rather than forwarding the
 *   SA-shaped payload verbatim.
 */

declare global {
    interface Window {
        sa_event?: (eventName: string, metadata?: Record<string, string | number | boolean | Date>) => void;
        sa_metadata?: Record<string, string | number | boolean | Date>;
        lantern?: { track: (name: string, metadata?: Record<string, string | number | boolean>) => void };
    }
}

/**
 * Forward an event to Lantern Analytics. No-op when the tracker isn't loaded.
 */
function trackLantern(
    eventName: string,
    metadata?: Record<string, string | number | boolean>
): void {
    if (typeof window !== "undefined" && window.lantern) {
        window.lantern.track(eventName, metadata);
    }
}

/**
 * Track a custom event with metadata
 * @param eventName - Name of the event (e.g., "click_download", "section_view")
 * @param metadata - Optional metadata object (text, boolean, number, or Date)
 */
export function trackEvent(
    eventName: string,
    metadata?: Record<string, string | number | boolean | Date>
): void {
    if (typeof window !== "undefined" && window.sa_event) {
        window.sa_event(eventName, metadata);
    }
}

/**
 * Set global metadata that will be included with all events and page views
 * @param metadata - Metadata object to set globally
 */
export function setGlobalMetadata(
    metadata: Record<string, string | number | boolean | Date>
): void {
    if (typeof window !== "undefined") {
        window.sa_metadata = metadata;
    }
}

/**
 * Track section view
 * @param sectionId - ID of the section being viewed
 */
export function trackSectionView(sectionId: string): void {
    trackEvent("section_view", {
        section_id: sectionId,
        timestamp: new Date(),
    });
    trackLantern("section_view", { section_id: sectionId });
}

/**
 * Track contact link click
 * @param platform - Platform name (e.g., "email", "linkedin", "github")
 */
export function trackContactClick(platform: string): void {
    trackEvent("contact_click", {
        platform: platform,
        timestamp: new Date(),
    });
    trackLantern("contact_click", { platform: platform });
}

/**
 * Track CV download
 */
export function trackCVDownload(): void {
    trackEvent("cv_download", {
        filename: "CV.pdf",
        timestamp: new Date(),
    });
    trackLantern("cv_download", { filename: "CV.pdf" });
}

/**
 * Track project link click
 * @param projectTitle - Title of the project
 * @param linkType - Type of link ("github" or "live")
 */
export function trackProjectLinkClick(projectTitle: string, linkType: "github" | "live"): void {
    trackEvent("project_link_click", {
        project_title: projectTitle,
        link_type: linkType,
        timestamp: new Date(),
    });
    trackLantern("project_link_click", {
        project_title: projectTitle,
        link_type: linkType,
    });
}

/**
 * Track project filter usage
 * @param tech - Technology name that was filtered
 */
export function trackProjectFilter(tech: string): void {
    trackEvent("project_filter", {
        tech: tech,
        timestamp: new Date(),
    });
    trackLantern("project_filter", { tech: tech });
}

