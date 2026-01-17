// Shared styles for story components

export const styles = {
  // Focus outline - consistent across all interactive elements
  focusOutline: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",

  // Drag handle
  dragHandle: "p-1.5 rounded cursor-grab active:cursor-grabbing",
  dragHandleDisabled: "p-1.5 rounded cursor-not-allowed",

  // Buttons (base without color)
  buttonBase: "font-semibold flex items-center gap-0.5 rounded px-1 py-0.5",
  button: "font-semibold flex items-center gap-0.5 rounded px-1 py-0.5 cursor-pointer text-violet-500",
  buttonDisabled: "font-semibold flex items-center gap-0.5 rounded px-1 py-0.5 cursor-not-allowed opacity-50 text-violet-500",

  // Icon buttons (trash, clone, lock)
  iconButton: "rounded p-1 cursor-pointer",
  iconButtonDisabled: "rounded p-1 cursor-not-allowed opacity-50",
  iconLockButton: "rounded p-1 cursor-pointer",
  iconLockButtonActive: "rounded p-1 cursor-pointer text-amber-600 opacity-[1.67]",

  // Lock button states
  lockButton: "font-semibold flex items-center gap-0.5 rounded px-1 py-0.5 cursor-pointer text-violet-500",
  lockButtonActive: "font-semibold flex items-center gap-0.5 rounded px-1 py-0.5 cursor-pointer text-amber-600 opacity-[1.67]",

  // Inputs & Selects
  input: "bg-white px-2 py-1 border border-gray-300 rounded-md flex-1 disabled:cursor-not-allowed",
  select: "border border-gray-300 rounded-sm px-1 py-0.5 disabled:cursor-not-allowed",

  // Locked state
  lockedContainer: "opacity-60",
};

// Helper to combine styles
export const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");
