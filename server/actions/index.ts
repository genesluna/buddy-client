'use server';

import { redirect } from 'next/navigation';
import { Url } from 'url';

export async function navigate(to: string) {
  redirect(to);
}
