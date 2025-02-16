//server action going to be called when the form is submitted
'use server';

import { z } from 'zod'; //this is a library that will validate the data correctly by the type that has been set before sending it to the server
import postgres from 'postgres'; //to insert data into the database
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, {ssl:'require'}); //connect to the database

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending','paid']),
    date: z.string(),
});
const CreateInvoice = FormSchema.omit({id:true, date:true});

export async function createInvoice(formData: FormData) {

      const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
      });
      const amountInCents = amount * 100; //store the amount in cents
      const date = new Date().toISOString().split('T')[0]; //store the date in ISO format "YYYY-MM-DD"

      await sql `
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;

      revalidatePath('/dashboard/invoices'); //revalidate ( clear the cache and trigger new request to the server )
      redirect('/dashboard/invoices'); //redirect to the invoices page

}