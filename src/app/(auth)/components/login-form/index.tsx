'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { cn } from '@/utils/utils'
import { buttonVariants } from '@/modules/common/components/button'
import { useSearchParams } from 'next/navigation'
import { Icons } from '@/modules/common/components/icons/icons'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { login, loginByFacialID } from '@/app/(auth)/lib/actions/login'
import { handleEmailValidation } from '@/utils/helpers/validate-email'
import { useFaceio } from '@/lib/hooks/use-faceio'
import {
  errorMessages,
  faceioErrorCode,
} from '@/utils/constants/face-auth-errors'
import { ToastAction } from '@/modules/common/components/toast/toast'

type FormValues = {
  email: string
  password: string
}

function LoginForm() {
  const { toast } = useToast()
  const { faceio } = useFaceio()
  const form = useForm<FormValues>()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl')
  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.setError(data.field as any, {
              type: 'custom',
              message: data.error,
            })
          }

          if (data?.success) {
            form.reset()
            toast({
              title: data.success,
              variant: 'success',
            })
          }
        })
        .catch(() =>
          toast({
            title: 'Algo ha salido mal',
            variant: 'destructive',
            description: 'Error al iniciar sesión',
          })
        )
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Este campo es requerido',
              validate: handleEmailValidation,
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            rules={{ required: 'Contraseña requerida' }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    disabled={isPending}
                    placeholder="**********"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Link
              href="/auth/reset"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'text-green-600'
              )}
            >
              Olvidé mi contraseña
            </Link>
          </div>

          <Button disabled={isPending} type="submit">
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Iniciar sesión
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
