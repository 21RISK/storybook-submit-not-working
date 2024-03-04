import type { ActionResult } from '@sveltejs/kit';
import type { EnhanceData } from './forms';
import * as devalue from 'devalue';
//import { applyAction } from '$app/forms';
//import { invalidateAll } from '$app/navigation';

function clone<T extends HTMLElement = HTMLElement>(element: HTMLElement) {
	return HTMLElement.prototype.cloneNode.call(element) as T;
}

function deserialize(result: string) {
	const parsed = JSON.parse(result);
	if (parsed.data) {
		parsed.data = devalue.parse(parsed.data);
	}
	return parsed;
}

export const mockEnhance = async ({ detail }: CustomEvent<EnhanceData>) => {
	console.log('storybook:enhance');

	detail.submitEvent.preventDefault();

	let cancelled = false;

	const formElement = detail.formElement;
	const action = new URL(
		detail.submitEvent.submitter?.hasAttribute('formaction')
			? (detail.submitEvent.submitter as HTMLButtonElement | HTMLInputElement).formAction
			: clone<HTMLFormElement>(formElement).action
	);
	const formData = new FormData(formElement);
	const cancel = () => (cancelled = true);
	const controller = new AbortController();
	const submitter = detail.submitEvent.submitter;

	const callback = await detail.submitFunction({
		action,
		cancel,
		controller,
		formData,
		formElement,
		submitter
	});
	if (cancelled) return;

	let result: ActionResult;

	try {
		const response = await fetch(action, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'x-sveltekit-action': 'true'
			},
			cache: 'no-store',
			body: formData,
			signal: controller.signal
		});

		result = deserialize(await response.text());
		if (result.type === 'error') result.status = response.status;
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if ((error as any)?.name === 'AbortError') return;
		result = { type: 'error', error };
	}

	if (!callback) return;

	callback({
		action,
		formData,
		formElement,
		result,
		async update() {}
	});
};
