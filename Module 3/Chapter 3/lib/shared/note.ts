export function getTitle(content: string) {
	const lineEnd = content.indexOf("\n");
	if (content === "" || lineEnd === 0) {
		return "Untitled";
	}
	if (lineEnd === -1) {
		// Note contains one line
		return content;
	}
	// Get first line
	return content.substring(0, lineEnd);
}
