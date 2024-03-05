<script lang="ts">
	import './button.css';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { userSchema } from './schema';
	import { zod } from 'sveltekit-superforms/adapters';
	import { mockEnhance } from '$lib/enhance';

	const formData = defaults(zod(userSchema));

	const spForm = superForm(formData, {
		//validators: zod(userSchema),
		async onResult(event) {
			if (event.result.type == 'error') {
				// Mocking the ActionResult (no client-side validation!)
				const validation = await spForm.validateForm({ schema: zod(userSchema) });

				event.result = {
					type: validation.valid ? 'success' : 'failure',
					status: validation.valid ? 200 : 400,
					data: { validation }
				};
			}
		}
	});
	const { enhance, errors, form } = spForm;

	let formElement: HTMLFormElement;

	window.addEventListener('storybook:enhance', mockEnhance);
</script>

<form id="form-1" use:enhance method="POST">
	<input
		type="text"
		name="name"
		bind:value={$form.name}
		aria-invalid={$errors.name ? 'true' : undefined}
	/>
	<button>Submit form with use:enhance</button>
	{#if $errors.name}<div class="invalid">{$errors.name}</div>{/if}
</form>

<form id="form-2" method="POST" style="margin-top: 20px;" bind:this={formElement}>
	<input type="text" name="name" value="Some text" />
	<button>Submit form, no enhance</button>
	<!-- can submit -->
</form>

<button type="button" on:click={() => formElement.requestSubmit()}
	>Submit form, no enhance also works</button
>

<button
	type="button"
	on:click={() => {
		console.log('Submit form button');
		//spForm.submit();
	}}>Submit form button</button
>

<style>
	.invalid {
		color: brown;
	}
</style>
