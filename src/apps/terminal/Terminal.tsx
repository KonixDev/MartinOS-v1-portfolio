'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AppProps } from '@/types';
import { getChildren, getItem } from '@/lib/filesystem/operations';
import { useFileSystemStore } from '@/stores';

interface HistoryEntry {
  type: 'input' | 'output' | 'error';
  content: string;
}

export function Terminal({ windowId }: AppProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', content: 'MartinOS Terminal [Version 1.0.0]' },
    { type: 'output', content: '(c) MartinOS Corporation. All rights reserved.\n' },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const addOutput = useCallback((content: string, type: 'output' | 'error' = 'output') => {
    setHistory((prev) => [...prev, { type, content }]);
  }, []);

  const executeCommand = useCallback(
    async (cmd: string) => {
      const trimmedCmd = cmd.trim();
      if (!trimmedCmd) return;

      // Add command to history
      setHistory((prev) => [...prev, { type: 'input', content: `${currentPath}> ${trimmedCmd}` }]);
      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);

      const parts = trimmedCmd.split(/\s+/);
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (command) {
        case 'help':
          addOutput(`
Available commands:
  help        - Show this help message
  cls         - Clear the screen
  dir         - List directory contents
  cd <path>   - Change directory
  pwd         - Print working directory
  echo <text> - Print text to screen
  date        - Show current date and time
  whoami      - Show current user
  ver         - Show version information
  exit        - Close terminal
`);
          break;

        case 'cls':
        case 'clear':
          setHistory([]);
          break;

        case 'dir':
        case 'ls':
          try {
            const items = await getChildren(currentPath);
            if (items.length === 0) {
              addOutput('Directory is empty.');
            } else {
              const formatted = items
                .map((item) => {
                  const date = new Date(item.modifiedAt).toLocaleDateString();
                  const type = item.type === 'folder' ? '<DIR>' : '     ';
                  const size = item.type === 'file' ? item.size.toString().padStart(10) : '          ';
                  return `${date}  ${type}  ${size}  ${item.name}`;
                })
                .join('\n');
              addOutput(`\n Directory of ${currentPath}\n\n${formatted}\n`);
            }
          } catch (error) {
            addOutput(`Error listing directory: ${error}`, 'error');
          }
          break;

        case 'cd':
          if (args.length === 0) {
            addOutput(currentPath);
          } else {
            const targetPath = args[0];
            let newPath: string;

            if (targetPath === '..') {
              const parts = currentPath.split('/').filter(Boolean);
              parts.pop();
              newPath = '/' + parts.join('/');
            } else if (targetPath.startsWith('/')) {
              newPath = targetPath;
            } else {
              newPath = currentPath === '/' ? `/${targetPath}` : `${currentPath}/${targetPath}`;
            }

            // Normalize path
            newPath = newPath.replace(/\/+/g, '/') || '/';

            // Verify path exists
            if (newPath === '/') {
              setCurrentPath('/');
            } else {
              const item = await getItem(newPath);
              if (item && item.type === 'folder') {
                setCurrentPath(newPath);
              } else {
                addOutput(`The system cannot find the path specified: ${newPath}`, 'error');
              }
            }
          }
          break;

        case 'pwd':
          addOutput(currentPath);
          break;

        case 'echo':
          addOutput(args.join(' '));
          break;

        case 'date':
          addOutput(new Date().toString());
          break;

        case 'whoami':
          addOutput('User');
          break;

        case 'ver':
        case 'version':
          addOutput('MartinOS Terminal [Version 1.0.0]');
          break;

        case 'exit':
          // Would close the terminal window
          addOutput('Type "exit" again to close the terminal.');
          break;

        default:
          addOutput(
            `'${command}' is not recognized as an internal command.\nType 'help' for a list of available commands.`,
            'error'
          );
      }
    },
    [currentPath, addOutput]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={cn(
        'h-full overflow-auto p-3 cursor-text',
        'bg-[#0c0c0c] text-[#cccccc]',
        'font-mono text-sm leading-relaxed'
      )}
    >
      {/* History */}
      {history.map((entry, index) => (
        <div
          key={index}
          className={cn(
            'whitespace-pre-wrap',
            entry.type === 'error' && 'text-red-400',
            entry.type === 'input' && 'text-[#cccccc]'
          )}
        >
          {entry.content}
        </div>
      ))}

      {/* Input line */}
      <div className="flex items-center">
        <span className="text-[#cccccc]">{currentPath}&gt; </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex-1 bg-transparent outline-none border-none',
            'text-[#cccccc] font-mono text-sm',
            'caret-[#cccccc]'
          )}
          autoFocus
          spellCheck={false}
        />
      </div>
    </div>
  );
}
