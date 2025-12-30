'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AppProps } from '@/types';
import { getItem } from '@/lib/filesystem/operations';
import {
  ZoomInFilled,
  ZoomOutFilled,
  ArrowResetFilled,
  FullScreenMaximizeFilled,
} from '@fluentui/react-icons';

export function ImageViewer({ windowId, props }: AppProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('Image');
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const filePath = props?.filePath as string | undefined;
      if (!filePath) {
        setError('No image specified');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const file = await getItem(filePath);
        if (file && file.type === 'file') {
          setFileName(file.name);

          // For virtual filesystem, we'd need to store actual image data
          // For now, show a placeholder or handle external URLs
          if (file.content?.startsWith('data:image')) {
            setImageSrc(file.content);
          } else {
            // Placeholder for demo
            setError('Image preview not available in virtual filesystem');
          }
        } else {
          setError('File not found');
        }
      } catch (err) {
        setError('Failed to load image');
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [props?.filePath]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 500));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 25));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className={cn('flex flex-col h-full', 'bg-neutral-900')}>
      {/* Toolbar */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-2',
          'bg-neutral-800 text-white'
        )}
      >
        <span className="text-sm truncate">{fileName}</span>

        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={<ZoomOutFilled className="w-4 h-4" />}
            onClick={handleZoomOut}
            title="Zoom out"
          />
          <span className="text-xs px-2 min-w-[50px] text-center">{zoom}%</span>
          <ToolbarButton
            icon={<ZoomInFilled className="w-4 h-4" />}
            onClick={handleZoomIn}
            title="Zoom in"
          />
          <ToolbarButton
            icon={<ArrowResetFilled className="w-4 h-4" />}
            onClick={handleResetZoom}
            title="Reset zoom"
          />
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {isLoading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-center">
            <div className="text-white/60 mb-2">{error}</div>
            <div className="text-white/40 text-sm">
              Images in the virtual filesystem require base64 encoding
            </div>
          </div>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={fileName}
            style={{ transform: `scale(${zoom / 100})` }}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            draggable={false}
          />
        ) : (
          <div className="text-white/60">No image to display</div>
        )}
      </div>

      {/* Status Bar */}
      <div
        className={cn(
          'h-6 px-4 flex items-center justify-between',
          'text-xs text-white/60',
          'bg-neutral-800'
        )}
      >
        <span>{fileName}</span>
        <span>{zoom}%</span>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}

function ToolbarButton({ icon, onClick, title }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded',
        'text-white/80 hover:text-white',
        'hover:bg-white/10 active:bg-white/20',
        'transition-colors duration-100'
      )}
    >
      {icon}
    </button>
  );
}
