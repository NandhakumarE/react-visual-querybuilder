// Shared styles for story components

export const styles = {
  // Focus outline - consistent across all interactive elements
  focusOutline: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:focus-visible:outline-violet-400",

  // Drag handle - transparent background
  dragHandle: "p-1.5 rounded cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors",
  dragHandleDisabled: "p-1.5 rounded cursor-not-allowed text-gray-300 dark:text-gray-600",

  // Buttons - transparent background
  buttonBase: "font-semibold flex items-center gap-0.5 rounded px-1.5 py-0.5",
  button: "font-semibold flex items-center gap-0.5 rounded px-1.5 py-0.5 cursor-pointer text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:text-violet-400 dark:hover:text-violet-300 dark:hover:bg-violet-500/10 transition-colors",
  buttonDisabled: "font-semibold flex items-center gap-0.5 rounded px-1.5 py-0.5 cursor-not-allowed opacity-50 text-violet-500 dark:text-violet-400",

  // Icon buttons - transparent background
  iconButton: "rounded p-1.5 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 transition-colors",
  iconButtonDisabled: "rounded p-1.5 cursor-not-allowed text-gray-300 dark:text-gray-600",
  iconLockButton: "rounded p-1.5 cursor-pointer text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-500/10 transition-colors",
  iconLockButtonActive: "rounded p-1.5 cursor-pointer text-amber-600 dark:text-amber-400",

  // Lock button states
  lockButton: "font-semibold flex items-center gap-0.5 rounded px-1.5 py-0.5 cursor-pointer text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:text-violet-400 dark:hover:text-violet-300 dark:hover:bg-violet-500/10 transition-colors",
  lockButtonActive: "font-semibold flex items-center gap-0.5 rounded px-1.5 py-0.5 cursor-pointer text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10 transition-colors",

  // Inputs & Selects
  input: "bg-white dark:bg-gray-800 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md flex-1 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-900",
  select: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm px-1.5 py-0.5 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-900",

  // Locked state
  lockedContainer: "opacity-60",

  // Container colors
  ruleContainer: "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 rounded-md",
  ruleCenterPanel: "border-x border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 flex-1 flex gap-4 items-center",
  ruleCenterPanelNoBorderLeft: "border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 flex-1 flex gap-4 items-center",

  groupContainer: "shadow-sm rounded-md pr-2 py-3 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900",

  // Text colors
  textMuted: "text-gray-500 dark:text-gray-400",
  textLabel: "text-gray-600 dark:text-gray-300",
};

// Helper to combine styles
export const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");
