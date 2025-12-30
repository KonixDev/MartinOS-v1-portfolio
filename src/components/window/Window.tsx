'use client';

import { ReactNode, useCallback, useState } from 'react';
import { Rnd, DraggableData } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WindowTitleBar } from './WindowTitleBar';
import { WindowContent } from './WindowContent';
import { useWindowStore } from '@/stores/windowStore';
import { TASKBAR_HEIGHT } from '@/constants';

// Snap zones
type SnapZone = 'left' | 'right' | 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;

const SNAP_THRESHOLD = 20; // pixels from edge to trigger snap

interface WindowProps {
  id: string;
  title: string;
  icon?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  children: ReactNode;
}

export function Window({
  id,
  title,
  icon,
  x,
  y,
  width,
  height,
  minWidth = 400,
  minHeight = 300,
  isMinimized,
  isMaximized,
  zIndex,
  children,
}: WindowProps) {
  const {
    activeWindowId,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();

  const [isClosing, setIsClosing] = useState(false);
  const [snapZone, setSnapZone] = useState<SnapZone>(null);
  const [isSnapped, setIsSnapped] = useState(false);
  const [preSnapState, setPreSnapState] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const isFocused = activeWindowId === id;

  // Detect snap zone based on mouse position
  const detectSnapZone = useCallback((mouseX: number, mouseY: number): SnapZone => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - TASKBAR_HEIGHT;

    const isLeft = mouseX <= SNAP_THRESHOLD;
    const isRight = mouseX >= screenWidth - SNAP_THRESHOLD;
    const isTop = mouseY <= SNAP_THRESHOLD;
    const isBottom = mouseY >= screenHeight - SNAP_THRESHOLD;

    // Corners first (higher priority)
    if (isTop && isLeft) return 'top-left';
    if (isTop && isRight) return 'top-right';
    if (isBottom && isLeft) return 'bottom-left';
    if (isBottom && isRight) return 'bottom-right';

    // Edges
    if (isTop) return 'top'; // Maximize
    if (isLeft) return 'left';
    if (isRight) return 'right';

    return null;
  }, []);

  // Get snap zone dimensions
  const getSnapDimensions = useCallback((zone: SnapZone) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - TASKBAR_HEIGHT;
    const halfWidth = screenWidth / 2;
    const halfHeight = screenHeight / 2;

    switch (zone) {
      case 'left':
        return { x: 0, y: 0, width: halfWidth, height: screenHeight };
      case 'right':
        return { x: halfWidth, y: 0, width: halfWidth, height: screenHeight };
      case 'top':
        return { x: 0, y: 0, width: screenWidth, height: screenHeight };
      case 'top-left':
        return { x: 0, y: 0, width: halfWidth, height: halfHeight };
      case 'top-right':
        return { x: halfWidth, y: 0, width: halfWidth, height: halfHeight };
      case 'bottom-left':
        return { x: 0, y: halfHeight, width: halfWidth, height: halfHeight };
      case 'bottom-right':
        return { x: halfWidth, y: halfHeight, width: halfWidth, height: halfHeight };
      default:
        return null;
    }
  }, []);

  // Handle window focus on click
  const handleFocus = useCallback(() => {
    if (!isFocused) {
      focusWindow(id);
    }
  }, [id, isFocused, focusWindow]);

  // Handle close with animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      closeWindow(id);
    }, 120);
  }, [id, closeWindow]);

  // Handle maximize/restore toggle
  const handleMaximizeToggle = useCallback(() => {
    if (isMaximized || isSnapped) {
      if (preSnapState) {
        updateWindowPosition(id, preSnapState.x, preSnapState.y);
        updateWindowSize(id, preSnapState.width, preSnapState.height);
        setPreSnapState(null);
      }
      restoreWindow(id);
      setIsSnapped(false);
    } else {
      maximizeWindow(id);
    }
  }, [id, isMaximized, isSnapped, preSnapState, maximizeWindow, restoreWindow, updateWindowPosition, updateWindowSize]);

  // Handle minimize
  const handleMinimize = useCallback(() => {
    minimizeWindow(id);
  }, [id, minimizeWindow]);

  // Handle drag
  const handleDrag = useCallback(
    (e: unknown, d: DraggableData) => {
      // Get mouse position from the drag event
      const mouseEvent = e as MouseEvent;
      const zone = detectSnapZone(mouseEvent.clientX, mouseEvent.clientY);
      setSnapZone(zone);
    },
    [detectSnapZone]
  );

  // Handle drag stop
  const handleDragStop = useCallback(
    (e: unknown, d: { x: number; y: number }) => {
      if (snapZone) {
        const snapDimensions = getSnapDimensions(snapZone);
        if (snapDimensions) {
          // Save current state before snapping
          if (!isSnapped && !preSnapState) {
            setPreSnapState({ x, y, width, height });
          }

          updateWindowPosition(id, snapDimensions.x, snapDimensions.y);
          updateWindowSize(id, snapDimensions.width, snapDimensions.height);
          setIsSnapped(true);

          if (snapZone === 'top') {
            maximizeWindow(id);
          }
        }
      } else {
        // Normal drag - if was snapped, restore to pre-snap size at new position
        if (isSnapped && preSnapState) {
          updateWindowSize(id, preSnapState.width, preSnapState.height);
          setPreSnapState(null);
          setIsSnapped(false);
        }
        updateWindowPosition(id, d.x, d.y);
      }
      setSnapZone(null);
    },
    [id, snapZone, isSnapped, preSnapState, x, y, width, height, getSnapDimensions, updateWindowPosition, updateWindowSize, maximizeWindow]
  );

  // Handle resize stop
  const handleResizeStop = useCallback(
    (
      _e: unknown,
      _direction: unknown,
      ref: HTMLElement,
      _delta: unknown,
      position: { x: number; y: number }
    ) => {
      updateWindowSize(id, ref.offsetWidth, ref.offsetHeight);
      updateWindowPosition(id, position.x, position.y);
      // Clear snap state when manually resizing
      setIsSnapped(false);
      setPreSnapState(null);
    },
    [id, updateWindowSize, updateWindowPosition]
  );

  // Don't render if minimized
  if (isMinimized) {
    return null;
  }

  const windowPosition = isMaximized ? { x: 0, y: 0 } : { x, y };
  const windowSize = isMaximized
    ? { width: '100%', height: `calc(100vh - ${TASKBAR_HEIGHT}px)` }
    : { width, height };

  const snapPreview = snapZone ? getSnapDimensions(snapZone) : null;

  return (
    <>
      {/* Snap Preview Overlay */}
      <AnimatePresence>
        {snapPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed pointer-events-none rounded-lg border-2 border-win-accent bg-win-accent/20"
            style={{
              left: snapPreview.x,
              top: snapPreview.y,
              width: snapPreview.width,
              height: snapPreview.height,
              zIndex: zIndex - 1,
            }}
          />
        )}
      </AnimatePresence>

      {/* Window */}
      <AnimatePresence>
        {!isClosing && (
          <Rnd
            position={windowPosition}
            size={windowSize}
            minWidth={minWidth}
            minHeight={minHeight}
            bounds="parent"
            dragHandleClassName="window-drag-handle"
            disableDragging={isMaximized}
            enableResizing={!isMaximized}
            onDrag={handleDrag}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            onMouseDown={handleFocus}
            style={{ zIndex }}
            resizeHandleStyles={{
              top: { cursor: 'n-resize' },
              right: { cursor: 'e-resize' },
              bottom: { cursor: 's-resize' },
              left: { cursor: 'w-resize' },
              topRight: { cursor: 'ne-resize' },
              bottomRight: { cursor: 'se-resize' },
              bottomLeft: { cursor: 'sw-resize' },
              topLeft: { cursor: 'nw-resize' },
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={cn(
                'flex flex-col h-full',
                'bg-win-bg-secondary dark:bg-win-dark-bg-secondary',
                'border border-win-border dark:border-win-dark-border',
                !isMaximized && !isSnapped && 'rounded-lg',
                isFocused ? 'window-shadow-active' : 'window-shadow'
              )}
            >
              {/* Title Bar - Drag Handle */}
              <div className="window-drag-handle">
                <WindowTitleBar
                  title={title}
                  icon={icon}
                  isMaximized={isMaximized || isSnapped}
                  isFocused={isFocused}
                  onMinimize={handleMinimize}
                  onMaximize={handleMaximizeToggle}
                  onClose={handleClose}
                  onDoubleClick={handleMaximizeToggle}
                />
              </div>

              {/* Window Content */}
              <WindowContent>
                {children}
              </WindowContent>
            </motion.div>
          </Rnd>
        )}
      </AnimatePresence>
    </>
  );
}
