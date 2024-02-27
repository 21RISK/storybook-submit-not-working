<script lang="ts">
  import './button.css';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { userSchema } from './schema';
	import { zod } from 'sveltekit-superforms/adapters';

  const formData = defaults({name: 'some name'}, zod(userSchema));

  const spForm = superForm(formData, {
    onSubmit: (data) => {
      console.log('Form submitted', data);
    }
  })
  const {enhance} = spForm;

  let formElement: HTMLFormElement;
</script>

<form id="form-1" use:enhance method="POST">
  <input type="text" name="name" value="Some text"/>
  <button>Submit form with use:enhance</button> <!-- Nothing seems to happen -->
</form>

<form id="form-2" method="POST" style="margin-top: 20px;" bind:this={formElement}>
  <input type="text" name="name" value="Some text"/>
  <button>Submit form, no enhance</button> <!-- can submit -->
</form>

<button type="button" on:click={() => formElement.requestSubmit()}>Submit form, no enhance also works</button>
