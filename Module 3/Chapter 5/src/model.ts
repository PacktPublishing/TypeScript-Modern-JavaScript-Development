export interface Scan {
	content: string;
	date: Date;
}

function startsWith(input: string, start: string) {
	return input.substring(0, start.length) === start;
}
export function isUrl({ content }: Scan) {
	if (content.indexOf(" ") !== -1) {
		return false;
	}
	return startsWith(content, "http://") || startsWith(content, "https://");
}
