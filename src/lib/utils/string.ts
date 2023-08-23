import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';

export function getDomain(event: ServerLoadEvent | RequestEvent) {
	return event.url.hostname.replace(/^www\./, '');
}

export function getBaseURL(url: URL) {
	return `${url.protocol}//${url.host}`;
}

export function getProviderId(provider: string, event: ServerLoadEvent | RequestEvent) {
	return `${getDomain(event)}-${provider}`;
}