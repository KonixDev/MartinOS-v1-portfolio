'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WindowTitleBar } from './WindowTitleBar';
import { WindowContent } from './WindowContent';
import { useWindowStore } from '@/stores/windowStore';
import { TASKBAR_HEIGHT } from '@/constants';

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
  const isFocused = activeWindowId === id;

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
    if (isMaximized) {
      restoreWindow(id);
    } else {
      maximizeWindow(id);
    }
  }, [id, isMaximized, maximizeWindow, restoreWindow]);

  // Handle minimize
  const handleMinimize = useCallback(() => {
    minimizeWindow(id);
  }, [id, minimizeWindow]);

  // Handle drag stop
  const handleDragStop = useCallback(
    (_e: unknown, d: { x: number; y: number }) => {
      updateWindowPosition(id, d.x, d.y);
    },
    [id, updateWindowPosition]
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

  return (
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
              !isMaximized && 'rounded-lg',
              isFocused ? 'window-shadow-active' : 'window-shadow'
            )}
          >
            {/* Title Bar - Drag Handle */}
            <div className="window-drag-handle">
              <WindowTitleBar
                title={title}
                icon={icon}
                isMaximized={isMaximized}
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
  );
}
