'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { Status } from '@prisma/client'
import { z } from 'zod'

const appointmentSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  date: z.string(),
  timeSlot: z.string(),
  notes: z.string().optional(),
})

export async function bookAppointment(formData: z.infer<typeof appointmentSchema>) {
  const parsed = appointmentSchema.safeParse(formData)
  if (!parsed.success) throw new Error('Invalid appointment data')

  const { userId, firstName, lastName, email, phone, date, timeSlot, notes } = parsed.data

  const existing = await prisma.appointment.findFirst({
    where: {
      date: new Date(date),
      timeSlot,
    },
  })

  if (existing) throw new Error('Time slot already booked')

  const appointment = await prisma.appointment.create({
    data: {
      userId,
      firstName,
      lastName,
      email,
      phone,
      date: new Date(date),
      timeSlot,
      notes,
      status: Status.PENDING,
    },
  })

  revalidatePath('/appointments')
  return appointment
}

// export async function getAvailableTimeSlots(date: string) {
//   const selectedDate = new Date(date)
//   const weekday = selectedDate.getDay()

//   const setting = await prisma.officeHourSetting.findFirst({
//     where: { dayOfWeek: weekday, isActive: true },
//   })

//   if (!setting) return []

//   const allSlots = generateTimeSlots(setting.startTime, setting.endTime)

//   const blocked = await prisma.blockedSlot.findMany({
//     where: { date: selectedDate },
//   })
//   const blockedTimes = blocked.map(b => b.timeSlot)

//   const appointments = await prisma.appointment.findMany({
//     where: {
//       date: selectedDate,
//       status: { not: Status.REJECTED },
//     },
//   })
//   const bookedTimes = appointments.map(a => a.timeSlot)

//   return allSlots.filter(t => !blockedTimes.includes(t) && !bookedTimes.includes(t))
// }

// function generateTimeSlots(start: string, end: string) {
//   const slots: string[] = []
//   let hour = parseInt(start.split(':')[0])
//   const endHour = parseInt(end.split(':')[0])

//   while (hour < endHour) {
//     slots.push(`${hour.toString().padStart(2, '0')}:00`)
//     hour++
//   }

//   return slots
// }

export async function getAppointmentsByUser(userId: string) {
  return prisma.appointment.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  })
}

export async function getAllAppointments() {
  return prisma.appointment.findMany({
    orderBy: { date: 'asc' },
  })
}

export async function updateAppointmentStatus(id: string, status: Status, reason?: string | null) {
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status, reason },
  })

  revalidatePath('/admin/appointments')
  return appointment
}

export async function cancelAppointment(id: string) {
  const appointment = await prisma.appointment.delete({
    where: { id },
  })

  revalidatePath('/appointments')
  return appointment
}

// export async function getDisabledDates() {
//   const allSettings = await prisma.officeHourSetting.findMany({
//     where: { isActive: false },
//   })

//   const blockedDays = await prisma.blockedSlot.findMany({
//     where: { timeSlot: null },
//   })

//   const blockedDates = blockedDays.map((b) => b.date.toISOString().split('T')[0])
//   return blockedDates
// }
