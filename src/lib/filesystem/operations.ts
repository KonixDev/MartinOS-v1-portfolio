import { db } from './index';
import { FileSystemItem, FileOperationResult } from '@/types';

// Path utilities
export const joinPath = (...parts: string[]): string => {
  return parts.join('/').replace(/\/+/g, '/');
};

export const getParentPath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/');
};

export const getFileName = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
};

export const getFileExtension = (name: string): string => {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

// CRUD Operations
export const createFolder = async (
  parentPath: string,
  name: string
): Promise<FileOperationResult> => {
  try {
    const path = joinPath(parentPath, name);

    // Check if folder already exists
    const existing = await db.items.where('path').equals(path).first();
    if (existing) {
      return { success: false, error: 'Folder already exists' };
    }

    const now = new Date();
    const folder: FileSystemItem = {
      name,
      path,
      parentPath,
      type: 'folder',
      size: 0,
      createdAt: now,
      modifiedAt: now,
    };

    await db.items.add(folder);
    return { success: true, item: folder };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const createFile = async (
  parentPath: string,
  name: string,
  content: string = ''
): Promise<FileOperationResult> => {
  try {
    const path = joinPath(parentPath, name);

    // Check if file already exists
    const existing = await db.items.where('path').equals(path).first();
    if (existing) {
      return { success: false, error: 'File already exists' };
    }

    const now = new Date();
    const file: FileSystemItem = {
      name,
      path,
      parentPath,
      type: 'file',
      mimeType: 'text/plain',
      content,
      size: new Blob([content]).size,
      createdAt: now,
      modifiedAt: now,
    };

    await db.items.add(file);
    return { success: true, item: file };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const getItem = async (path: string): Promise<FileSystemItem | undefined> => {
  return db.items.where('path').equals(path).first();
};

export const getChildren = async (parentPath: string): Promise<FileSystemItem[]> => {
  return db.items.where('parentPath').equals(parentPath).toArray();
};

export const deleteItem = async (path: string): Promise<FileOperationResult> => {
  try {
    const item = await getItem(path);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    // If it's a folder, delete all children recursively
    if (item.type === 'folder') {
      const children = await getChildren(path);
      for (const child of children) {
        await deleteItem(child.path);
      }
    }

    await db.items.where('path').equals(path).delete();
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const renameItem = async (
  path: string,
  newName: string
): Promise<FileOperationResult> => {
  try {
    const item = await getItem(path);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    const newPath = joinPath(item.parentPath, newName);

    // Check if new path already exists
    const existing = await getItem(newPath);
    if (existing) {
      return { success: false, error: 'An item with this name already exists' };
    }

    await db.items.where('path').equals(path).modify({
      name: newName,
      path: newPath,
      modifiedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const updateFileContent = async (
  path: string,
  content: string
): Promise<FileOperationResult> => {
  try {
    const item = await getItem(path);
    if (!item) {
      return { success: false, error: 'File not found' };
    }

    if (item.type !== 'file') {
      return { success: false, error: 'Cannot update content of a folder' };
    }

    await db.items.where('path').equals(path).modify({
      content,
      size: new Blob([content]).size,
      modifiedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const moveItem = async (
  fromPath: string,
  toPath: string
): Promise<FileOperationResult> => {
  try {
    const item = await getItem(fromPath);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    const newParentPath = getParentPath(toPath);
    const newName = getFileName(toPath);

    // Check if destination already exists
    const existing = await getItem(toPath);
    if (existing) {
      return { success: false, error: 'An item with this name already exists at the destination' };
    }

    // Check if destination folder exists
    if (newParentPath !== '/') {
      const parentFolder = await getItem(newParentPath);
      if (!parentFolder || parentFolder.type !== 'folder') {
        return { success: false, error: 'Destination folder does not exist' };
      }
    }

    // If it's a folder, we need to move all children recursively
    if (item.type === 'folder') {
      const children = await getChildren(fromPath);
      for (const child of children) {
        const childNewPath = joinPath(toPath, child.name);
        await moveItem(child.path, childNewPath);
      }
    }

    // Update the item's path and parent
    await db.items.where('path').equals(fromPath).modify({
      name: newName,
      path: toPath,
      parentPath: newParentPath,
      modifiedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const copyItem = async (
  fromPath: string,
  toPath: string
): Promise<FileOperationResult> => {
  try {
    const item = await getItem(fromPath);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    const newParentPath = getParentPath(toPath);
    const newName = getFileName(toPath);

    // Check if destination already exists
    const existing = await getItem(toPath);
    if (existing) {
      return { success: false, error: 'An item with this name already exists at the destination' };
    }

    // Check if destination folder exists
    if (newParentPath !== '/') {
      const parentFolder = await getItem(newParentPath);
      if (!parentFolder || parentFolder.type !== 'folder') {
        return { success: false, error: 'Destination folder does not exist' };
      }
    }

    const now = new Date();

    // Create copy of the item
    const newItem: FileSystemItem = {
      name: newName,
      path: toPath,
      parentPath: newParentPath,
      type: item.type,
      mimeType: item.mimeType,
      content: item.content,
      size: item.size,
      createdAt: now,
      modifiedAt: now,
    };

    await db.items.add(newItem);

    // If it's a folder, copy all children recursively
    if (item.type === 'folder') {
      const children = await getChildren(fromPath);
      for (const child of children) {
        const childNewPath = joinPath(toPath, child.name);
        await copyItem(child.path, childNewPath);
      }
    }

    return { success: true, item: newItem };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const itemExists = async (path: string): Promise<boolean> => {
  const item = await getItem(path);
  return !!item;
};

export const getAllItems = async (): Promise<FileSystemItem[]> => {
  return db.items.toArray();
};
