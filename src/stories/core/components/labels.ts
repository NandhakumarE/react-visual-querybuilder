/**
 * Labels for all user-facing text in the query builder UI.
 * Use this to provide translations for different languages.
 */
export interface Labels {
  // Combinators
  /** Label for AND combinator (e.g., "AND", "Y", "ET", "かつ") */
  and: string;
  /** Label for OR combinator (e.g., "OR", "O", "OU", "または") */
  or: string;

  // Placeholders
  /** Placeholder for field selector */
  selectField: string;
  /** Placeholder for operator selector */
  selectOperator: string;
  /** Placeholder/label for range start input */
  from: string;
  /** Label between range inputs (e.g., "to", "hasta", "à", "まで") */
  to: string;

  // Buttons
  /** Add rule button text */
  addRule: string;
  /** Add group button text */
  addGroup: string;
  /** Remove/delete button text */
  remove: string;
  /** Clone/duplicate button text */
  clone: string;
  /** Lock button text */
  lock: string;
  /** Unlock button text */
  unlock: string;

  // Date format
  /** Date format placeholder (e.g., "mm/dd/yyyy", "dd/mm/yyyy", "yyyy-mm-dd") */
  dateFormat: string;
}

/** Default English labels */
export const defaultLabels: Labels = {
  and: "AND",
  or: "OR",
  selectField: "Select field",
  selectOperator: "Select operator",
  from: "From",
  to: "to",
  addRule: "Add Rule",
  addGroup: "Add Group",
  remove: "Remove",
  clone: "Clone",
  lock: "Lock",
  unlock: "Unlock",
  dateFormat: "mm/dd/yyyy",
};