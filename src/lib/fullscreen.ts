export const enterFullscreen = async (element: HTMLElement) => {
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      await (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      await (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      await (element as any).msRequestFullscreen();
    }
  } catch (error) {
    console.error("Error entering fullscreen:", error);
  }
};

export const exitFullscreen = async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if ((document as any).webkitFullscreenElement) {
      await (document as any).webkitExitFullscreen();
    } else if ((document as any).mozFullScreenElement) {
      await (document as any).mozCancelFullScreen();
    }
  } catch (error) {
    console.error("Error exiting fullscreen:", error);
  }
};

export const isFullscreenEnabled = (): boolean => {
  return (
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled ||
    false
  );
};
