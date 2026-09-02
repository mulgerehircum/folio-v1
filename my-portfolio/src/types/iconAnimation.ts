export type IconAnimationConfig =
  | {
      type: "heap-drop"
    }
  | {
      type: "document-draw"
    }
  | {
      type: "workflow-build"
    }
  | {
      type: "slide-in"
    }
  | {
      type: "boxes-separate"
    }
  | {
      type: "gauge-speed"
    }

export function isHeapDropAnimation(
  animation: IconAnimationConfig | undefined,
): boolean {
  return animation?.type === "heap-drop"
}

export function isDocumentDrawAnimation(
  animation: IconAnimationConfig | undefined,
): boolean {
  return animation?.type === "document-draw"
}

export function isWorkflowBuildAnimation(
  animation: IconAnimationConfig | undefined,
): boolean {
  return animation?.type === "workflow-build"
}

export function isSlideInAnimation(
  animation: IconAnimationConfig | undefined,
): boolean {
  return animation?.type === "slide-in"
}

export function isBoxesSeparateAnimation(
  animation: IconAnimationConfig | undefined,
): boolean {
  return animation?.type === "boxes-separate"
}

export function isGaugeSpeedAnimation(
  animation: IconAnimationConfig | undefined,
): boolean {
  return animation?.type === "gauge-speed"
}
