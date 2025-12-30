import { create } from 'zustand';
import { FileSystemItem, ClipboardItem } from '@/types';
import {
  getChildren,
  getItem,
  createFolder,
  createFile,
  deleteItem,
  renameItem,
  moveItem,
  copyItem,
  updateFileContent,
  joinPath,
} from '@/lib/filesystem/operations';
import { initializeFileSystem } from '@/lib/filesystem/defaultFiles';

interface FileSystemState {
  currentPath: string;
  items: FileSystemItem[];
  selectedItems: string[];
  clipboard: ClipboardItem | null;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface FileSystemActions {
  initialize: () => Promise<void>;
  navigateTo: (path: string) => Promise<void>;
  goBack: () => Promise<void>;
  goForward: () => Promise<void>;
  goUp: () => Promise<void>;
  refresh: () => Promise<void>;
  selectItem: (path: string, addToSelection?: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  copySelected: () => void;
  cutSelected: () => void;
  paste: () => Promise<void>;
  createNewFolder: (name: string) => Promise<boolean>;
  createNewFile: (name: string, content?: string) => Promise<boolean>;
  deleteSelected: () => Promise<boolean>;
  renameItemAt: (path: string, newName: string) => Promise<boolean>;
  openFile: (path: string) => Promise<FileSystemItem | null>;
  saveFile: (path: string, content: string) => Promise<boolean>;
}

type FileSystemStore = FileSystemState & FileSystemActions;

export const useFileSystemStore = create<FileSystemStore>()((set, get) => ({
  currentPath: '/Desktop',
  items: [],
  selectedItems: [],
  clipboard: null,
  history: ['/Desktop'],
  historyIndex: 0,
  isLoading: false,
  error: null,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });
    try {
      await initializeFileSystem();
      const items = await getChildren('/Desktop');
      set({
        items,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      set({
        error: String(error),
        isLoading: false,
      });
    }
  },

  navigateTo: async (path: string) => {
    set({ isLoading: true, error: null });
    try {
      const item = await getItem(path);

      // If path is root or a folder
      if (path === '/' || (item && item.type === 'folder')) {
        const items = await getChildren(path);
        const { history, historyIndex } = get();

        // Add to history (remove forward history if navigating from middle)
        const newHistory = [...history.slice(0, historyIndex + 1), path];

        set({
          currentPath: path,
          items,
          selectedItems: [],
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isLoading: false,
        });
      } else {
        set({ isLoading: false, error: 'Not a valid folder' });
      }
    } catch (error) {
      set({
        error: String(error),
        isLoading: false,
      });
    }
  },

  goBack: async () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const path = history[newIndex];

      set({ isLoading: true });
      const items = await getChildren(path);
      set({
        currentPath: path,
        items,
        selectedItems: [],
        historyIndex: newIndex,
        isLoading: false,
      });
    }
  },

  goForward: async () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const path = history[newIndex];

      set({ isLoading: true });
      const items = await getChildren(path);
      set({
        currentPath: path,
        items,
        selectedItems: [],
        historyIndex: newIndex,
        isLoading: false,
      });
    }
  },

  goUp: async () => {
    const { currentPath } = get();
    if (currentPath === '/') return;

    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const parentPath = '/' + parts.join('/');

    await get().navigateTo(parentPath || '/');
  },

  refresh: async () => {
    const { currentPath } = get();
    set({ isLoading: true });
    const items = await getChildren(currentPath);
    set({ items, isLoading: false });
  },

  selectItem: (path: string, addToSelection = false) => {
    set((state) => {
      if (addToSelection) {
        const isSelected = state.selectedItems.includes(path);
        return {
          selectedItems: isSelected
            ? state.selectedItems.filter((p) => p !== path)
            : [...state.selectedItems, path],
        };
      }
      return { selectedItems: [path] };
    });
  },

  selectAll: () => {
    set((state) => ({
      selectedItems: state.items.map((item) => item.path),
    }));
  },

  clearSelection: () => {
    set({ selectedItems: [] });
  },

  copySelected: () => {
    const { selectedItems, items } = get();
    const selectedFileItems = items.filter((item) =>
      selectedItems.includes(item.path)
    );

    if (selectedFileItems.length > 0) {
      set({
        clipboard: {
          items: selectedFileItems,
          operation: 'copy',
        },
      });
    }
  },

  cutSelected: () => {
    const { selectedItems, items } = get();
    const selectedFileItems = items.filter((item) =>
      selectedItems.includes(item.path)
    );

    if (selectedFileItems.length > 0) {
      set({
        clipboard: {
          items: selectedFileItems,
          operation: 'cut',
        },
      });
    }
  },

  paste: async () => {
    const { clipboard, currentPath } = get();
    if (!clipboard) return;

    set({ isLoading: true });

    try {
      for (const item of clipboard.items) {
        const destPath = joinPath(currentPath, item.name);

        if (clipboard.operation === 'copy') {
          await copyItem(item.path, destPath);
        } else {
          await moveItem(item.path, destPath);
        }
      }

      // Clear clipboard if it was a cut operation
      if (clipboard.operation === 'cut') {
        set({ clipboard: null });
      }

      // Refresh current folder
      await get().refresh();
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  createNewFolder: async (name: string) => {
    const { currentPath } = get();
    set({ isLoading: true });

    const result = await createFolder(currentPath, name);

    if (result.success) {
      await get().refresh();
      return true;
    } else {
      set({ error: result.error || 'Failed to create folder', isLoading: false });
      return false;
    }
  },

  createNewFile: async (name: string, content = '') => {
    const { currentPath } = get();
    set({ isLoading: true });

    const result = await createFile(currentPath, name, content);

    if (result.success) {
      await get().refresh();
      return true;
    } else {
      set({ error: result.error || 'Failed to create file', isLoading: false });
      return false;
    }
  },

  deleteSelected: async () => {
    const { selectedItems } = get();
    if (selectedItems.length === 0) return false;

    set({ isLoading: true });

    let success = true;
    for (const path of selectedItems) {
      const result = await deleteItem(path);
      if (!result.success) {
        success = false;
        set({ error: result.error || 'Failed to delete item' });
      }
    }

    if (success) {
      set({ selectedItems: [] });
    }

    await get().refresh();
    return success;
  },

  renameItemAt: async (path: string, newName: string) => {
    set({ isLoading: true });

    const result = await renameItem(path, newName);

    if (result.success) {
      await get().refresh();
      return true;
    } else {
      set({ error: result.error || 'Failed to rename item', isLoading: false });
      return false;
    }
  },

  openFile: async (path: string) => {
    const item = await getItem(path);
    return item || null;
  },

  saveFile: async (path: string, content: string) => {
    const result = await updateFileContent(path, content);
    return result.success;
  },
}));
