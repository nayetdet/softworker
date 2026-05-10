import { redirect } from 'next/navigation'

export default function NotFound(): null {
  redirect('/')
}
