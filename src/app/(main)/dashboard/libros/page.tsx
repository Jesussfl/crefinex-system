import { BookOpen, Plus } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
import { getAllBooks } from './lib/actions/book-actions'

export const metadata: Metadata = {
  title: 'Libros',
  description: 'Desde aquí puedes visualizar todos los libros de Crefinex',
}
export default async function Page() {
  const books = await getAllBooks()

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <BookOpen size={24} />
            Libros de Crefinex
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todos los libros de Crefinex
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/libros/libro/nuevo"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Libro
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="datos">
        <TabsList className="mx-5">
          <TabsTrigger value="datos">Información de los Libros</TabsTrigger>
        </TabsList>
        <TabsContent value="datos">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">
                  Información de los Libros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={books} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
