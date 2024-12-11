'use client';
import React, { useActionState, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { FormSchema } from '@/lib/validation';
import {z} from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createPitch } from '@/lib/actions';

const StartupForm = () => {
  const [errors,seterrors] = useState<Record<string,string>>({});
  const [pitch,setpitch]= useState('');

  const {toast} = useToast();
  const router = useRouter();

  const handleFormSubmit =async (prevstate: any, formData : FormData)=>{
    try {
        const form_values = {
           title: formData.get('title') as string,
           description : formData.get('description') as string,
           category : formData.get('category') as string,
           link : formData.get('link') as string,
           pitch,
        }

        await FormSchema.parseAsync(form_values);

        const result = await createPitch(prevstate, formData, pitch);


        if(result.status === "SUCCESS"){
           toast({
            title : "Success",
            description : "Your Startup pitch has been created successfully"
           })

           router.push(`/startup/${result._id}`);
        }

        return result;

    }

    catch (error) {
        if(error instanceof z.ZodError) {
             const fieldErrors = error.flatten().fieldErrors;
       
            seterrors(fieldErrors as unknown as Record<string,string>)
            
            toast({
                title : 'Error',
                description : 'Please check your inputs and try again',
                variant : 'destructive',
            });
            
            return {...prevstate, error : "Validation failed", status : "ERROR"}
            }

            toast({
                title : 'Error',
                description : 'An Unexpected error has occured',
                variant : 'destructive',
            })

            return {
                ...prevstate, status :'ERROR', error : "Unexpected error has occured"
            }

    } finally{

    }
  }

  const [state,formAction,isPending]=useActionState(handleFormSubmit,{error : '', status : "INITIAL"});


    return (
   <form action={formAction} className='startup-form'>
      <div>
         <label htmlFor='title' className='startup-form_label'>Title</label>
         <Input required placeholder='Startup Title' id='title' name='title' className='startup-form_input'/>
         {errors.title && <p className='startup-form_error'>{errors.title}</p>}
      </div>

      <div>
         <label htmlFor='description' className='startup-form_label'>Description</label>
        <Textarea id='description' name='description' className='startup-form_textarea' required placeholder='Startup Description'/>
         {errors.description && <p className='startup-form_error'>{errors.description}</p>}
      </div>

      <div>
         <label htmlFor='category' className='startup-form_label'>Category</label>
         <Input required placeholder='Startup category (Tech, Health, Education...)' id='category' name='category' className='startup-form_input'/>
         {errors.category && <p className='startup-form_error'>{errors.category}</p>}
      </div>

      <div>
         <label htmlFor='link' className='startup-form_label'>Image URL</label>
         <Input required placeholder='Startup Image URL' id='link' name='link' className='startup-form_input'/>
         {errors.link && <p className='startup-form_error'>{errors.link}</p>}
      </div>

      <div data-color-mode="light">
         <label htmlFor='pitch' className='startup-form_label'>Pitch</label>
         <MDEditor id="pitch" preview="edit" height={300} style={{borderRadius : 20, overflow : "hidden"}} textareaProps={{
            placeholder : "briefly describe your idea and what problme it solves"
         }} previewOptions={{
            disallowedElements : ['style']
         }} value={pitch} onChange={(value)=>setpitch(value as string)}/>
         {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
      </div>

      <Button disabled={isPending} type='submit' className='startup-form_btn text-white'>
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
    </Button>
   </form>
  )
}

export default StartupForm