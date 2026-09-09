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
 * Track CV download. No metadata: there's exactly one CV file behind this
 * button (see Hero.tsx), so a "filename" field would be a compile-time
 * constant on every single call — zero variance, zero information, and it
 * showed up as a hollow "insight" in Lantern's AI summaries for exactly
 * that reason. Revisit if a second CV variant (e.g. a language or
 * one-page version) is ever added — that's the point where a dimension
 * here would actually carry signal.
 */
export function trackCVDownload(): void {
    trackEvent("cv_download", { timestamp: new Date() });
    trackLantern("cv_download");
}

/**
 * Track project link click
 * @param projectTitle - Title of the project
 * @param linkType - Type of link ("github" or "live")
 */
export function trackProjectLinkClick(
    projectTitle: string,
    linkType: "github" | "live"
): void {
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
 * Track a click that expands the live-site iframe modal (the poster
 * click on cards whose live site is embeddable — as opposed to the
 * "Link" anchor which navigates away — see ProjectCard.tsx's
 * handlePosterClick).
 */
export function trackIframeExpand(projectTitle: string): void {
    trackEvent("iframe_expand_click", {
        project_title: projectTitle,
        timestamp: new Date(),
    });
    trackLantern("iframe_expand_click", {
        project_title: projectTitle,
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

/**
 * Track hover that replays an Expertise card's icon animation.
 * Fires on the same interaction that triggers the dissolve-up + refall
 * (see ExpertiseCard.tsx handleHoverReplay). Kept separate from
 * Lantern's automatic heatmap click capture so the replay intent is
 * explicit in the Lantern dashboard.
 * @param cardTitle - Expertise card title (e.g. "Frontend Foundations")
 * @param animationType - IconAnimationConfig type (e.g. "heap-drop")
 */
export function trackExpertiseIconHover(cardTitle: string, animationType: string): void {
    trackEvent("expertise_icon_hover", {
        card_title: cardTitle,
        animation_type: animationType,
        timestamp: new Date(),
    });
    trackLantern("expertise_icon_hover", {
        card_title: cardTitle,
        animation_type: animationType,
    });
}

