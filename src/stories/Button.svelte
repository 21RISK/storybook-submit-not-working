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

</script>

<form id="form-1" use:enhance method="POST">

  <input type="text" name="name" value="Some text"/>

  <button>Submit form with use:enhance</button>
</form>

<form id="form-2" method="POST" style="margin-top: 20px;">

  <input type="text" name="name" value="Some text"/>

  <button>Submit form, no enhance</button>
</form>

