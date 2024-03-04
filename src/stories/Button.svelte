<script lang="ts">
	import './button.css';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { userSchema } from './schema';
	import { zod } from 'sveltekit-superforms/adapters';
	import { mockEnhance } from '$lib/enhance';

	const formData = defaults({ name: 'some name' }, zod(userSchema));

	const spForm = superForm(formData, {
		onSubmit: (data) => {
			console.log('🚀 ~ onSubmit:', data);
		},
		onUpdated(event) {
			console.log('🚀 ~ onUpdated:', event);
		},
		onError(event) {
			console.log('🚀 ~ onError:', event);
		}
	});
	const { enhance, errors } = spForm;

	let formElement: HTMLFormElement;

	window.addEventListener('storybook:enhance', mockEnhance);
</script>

<form id="form-1" use:enhance method="POST">
	<input type="text" name="name" />
	<span class="invalid"
		>{#if $errors.name}{$errors.name}{/if}</span
	>
	<button>Submit form with use:enhance</button>
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
