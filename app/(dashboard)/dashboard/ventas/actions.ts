'use server'

import { getCurrentUser } from '@/lib/dal/auth'
import { obtenerPedido, aprobarManual } from '@/lib/dal/pedidos'
import { entregarPedido } from '@/lib/dal/entrega'
import { revalidatePath } from 'next/cache'

export async function aprobarPedidoAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const pedido = await obtenerPedido(id)
  if (!pedido || pedido.user_id !== user.id) return { error: 'No autorizado' }
  if (pedido.estado !== 'pendiente_manual') return { error: 'Este pedido no está pendiente de confirmación' }

  const aprobado = await aprobarManual(id)
  if (!aprobado) return { error: 'No se pudo aprobar el pedido' }

  await entregarPedido(aprobado)
  revalidatePath('/dashboard/ventas')
  return { success: true }
}
