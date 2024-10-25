import { TextEditor } from 'vscode';

export function getSelectionRange(editor: TextEditor) {
  return editor.selection.isEmpty
    ? {
        start: editor.selection.active.line,
        end: editor.selection.active.line,
      }
    : {
        start: editor.selection.start.line,
        end: editor.selection.end.line,
      };
}
