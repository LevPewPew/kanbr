import React, { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { FormErrorMessage, FormLabel, FormControl, Input } from '@chakra-ui/react';
import { z } from 'zod';
import { useMutation, useZodForm } from '~/hooks';
import { sanitizeReactHookFormValues } from '~/helpers';
import { Button } from '~/components';

// TODO finish off doing schema properly
const createDeckSchema = z.object({
  title: z.string().min(1, { message: 'Required' }),
  description: z.string().nullish(),
  projectId: z.string(),
});

type DeckFormSchema = z.infer<typeof createDeckSchema>;

export default function DeckForm() {
  const router = useRouter();
  const { projectId } = router.query;
  const createDeck = useMutation(['decks.create']);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useZodForm({
    schema: createDeckSchema,
    defaultValues: {
      title: '',
      description: '',
    },
  });

  function onSubmit(values: DeckFormSchema) {
    const sanitizedValues = sanitizeReactHookFormValues(values);
    createDeck.mutate(sanitizedValues);
  }

  useEffect(() => {
    if (createDeck.isSuccess) {
      Router.push(`/projects/${projectId}/decks`);
    }
  }, [createDeck.isSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={Boolean(errors.title)}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input id="title" placeholder="title" {...register('title')} />
        {errors.title && <FormErrorMessage>{errors.title.message}</FormErrorMessage>}
      </FormControl>
      <FormControl isInvalid={Boolean(errors.description)}>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input id="description" placeholder="description" {...register('description')} />
        {errors.description && <FormErrorMessage>{errors.description.message}</FormErrorMessage>}
      </FormControl>
      <Button mt={4} isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
}
