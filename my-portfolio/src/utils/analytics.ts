/**
 * Simple Analytics utility functions for tracking events with metadata
 */

declare global {
    interface Window {
        sa_event?: (eventName: string, metadata?: Record<string, string | number | boolean | Date>) => void;
        sa_metadata?: Record<string, string | number | boolean | Date>;
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
}

/**
 * Track CV download
 */
export function trackCVDownload(): void {
    trackEvent("cv_download", {
        filename: "CV.pdf",
        timestamp: new Date(),
    });
}

