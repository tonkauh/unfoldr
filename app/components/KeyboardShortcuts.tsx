'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onSave?: () => void;
  onCopy?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useKeyboardShortcuts({
  onSave,
  onCopy,
  onUndo,
  onRedo,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S: Save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }

      // Cmd/Ctrl + C: Copy (custom handler)
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        // Allow normal copy behavior
      }

      // Cmd/Ctrl + Z: Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
      }

      // Cmd/Ctrl + Shift + Z: Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        onRedo?.();
      }

      // Cmd/Ctrl + Y: Redo (Windows style)
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        onRedo?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onCopy, onUndo, onRedo]);
}

export function KeyboardShortcutsHelp() {
  return (
    <div className="text-[10px] space-y-2 text-[#8A817C] font-serif italic opacity-70">
      <div><kbd className="bg-[#F0EBE7] px-2 py-1 rounded">⌘ S</kbd> Save Draft</div>
      <div><kbd className="bg-[#F0EBE7] px-2 py-1 rounded">⌘ Z</kbd> Undo</div>
      <div><kbd className="bg-[#F0EBE7] px-2 py-1 rounded">⌘ ⇧ Z</kbd> Redo</div>
    </div>
  );
}
