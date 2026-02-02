"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag as TagIcon, Plus, X, Check } from "lucide-react";
import { Tag, TagColor } from "@/types/todo";
import { TagBadge } from "./TagBadge";

const colorOptions: { color: TagColor; className: string }[] = [
  { color: "gray", className: "bg-gray-400" },
  { color: "red", className: "bg-red-500" },
  { color: "orange", className: "bg-orange-500" },
  { color: "yellow", className: "bg-yellow-500" },
  { color: "green", className: "bg-green-500" },
  { color: "blue", className: "bg-blue-500" },
  { color: "purple", className: "bg-purple-500" },
  { color: "pink", className: "bg-pink-500" },
];

interface TagPickerProps {
  availableTags: Tag[];
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  onCreateTag: (name: string, color: TagColor) => Tag;
}

export function TagPicker({
  availableTags,
  selectedTagIds,
  onTagsChange,
  onCreateTag,
}: TagPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState<TagColor>("blue");
  const [showCreate, setShowCreate] = useState(false);

  const selectedTags = availableTags.filter((t) => selectedTagIds.includes(t.id));
  const unselectedTags = availableTags.filter((t) => !selectedTagIds.includes(t.id));

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const tag = onCreateTag(newTagName.trim(), newTagColor);
      onTagsChange([...selectedTagIds, tag.id]);
      setNewTagName("");
      setShowCreate(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors ${
          selectedTagIds.length > 0
            ? "text-accent hover:bg-accent/10"
            : "text-muted hover:text-foreground hover:bg-border"
        }`}
        aria-label="Manage tags"
      >
        <TagIcon size={14} />
        {selectedTagIds.length > 0 && (
          <span className="font-medium">{selectedTagIds.length}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl bg-card border border-border p-3 shadow-xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Tags</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-5 w-5 items-center justify-center rounded text-muted hover:text-foreground"
                >
                  <X size={12} />
                </button>
              </div>

              {selectedTags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      size="md"
                      onRemove={() => handleToggleTag(tag.id)}
                    />
                  ))}
                </div>
              )}

              {unselectedTags.length > 0 && (
                <div className="mb-3 space-y-1">
                  {unselectedTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleToggleTag(tag.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-border hover:text-foreground transition-colors"
                    >
                      <TagBadge tag={tag} size="md" />
                    </button>
                  ))}
                </div>
              )}

              {!showCreate ? (
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-border hover:text-foreground transition-colors"
                >
                  <Plus size={14} />
                  Create new tag
                </button>
              ) : (
                <div className="space-y-2 rounded-lg bg-background p-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Tag name..."
                    maxLength={20}
                    className="w-full rounded-lg bg-card border border-border px-2 py-1.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-accent"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateTag();
                      if (e.key === "Escape") setShowCreate(false);
                    }}
                  />
                  <div className="flex items-center gap-1">
                    {colorOptions.map(({ color, className }) => (
                      <button
                        key={color}
                        onClick={() => setNewTagColor(color)}
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${className} transition-transform ${
                          newTagColor === color ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : "hover:scale-110"
                        }`}
                        aria-label={`Select ${color} color`}
                      >
                        {newTagColor === color && <Check size={12} className="text-white" />}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCreate(false)}
                      className="flex-1 rounded-lg px-2 py-1 text-xs text-muted hover:bg-border transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim()}
                      className="flex-1 rounded-lg bg-accent px-2 py-1 text-xs text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
