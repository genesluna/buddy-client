'use server';

import { redirect } from 'next/navigation';

export async function navigate(to: string) {
  redirect(to);
}
