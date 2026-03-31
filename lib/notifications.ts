/**
 * Notifications Library for Teduh.app
 * Supports Push Notifications, Email, and WhatsApp
 */

import type { BookingWithDetails } from '@/types'

// Types
export type NotificationType = 'booking_confirmed' | 'booking_reminder' | 'booking_cancelled' | 'facility_maintenance'

export interface NotificationPayload {
  type: NotificationType
  booking?: BookingWithDetails
  userId: string
  title: string
  body: string
  data?: Record<string, unknown>
}

// ============================================
// PUSH NOTIFICATIONS (Web Push API)
// ============================================

/**
 * Request permission for push notifications
 */
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

/**
 * Subscribe to push notifications
 * This would integrate with Supabase's push notification service
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    // Send subscription to server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })

    return subscription
  } catch (error) {
    console.error('Push subscription failed:', error)
    return null
  }
}

/**
 * Show local notification
 */
export function showLocalNotification(title: string, body: string, data?: Record<string, unknown>): void {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: data?.type as string || 'teduh-notification',
      data,
    })
  }
}

/**
 * Send push notification via Supabase
 */
export async function sendPushNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send push notification:', error)
    return false
  }
}

// ============================================
// EMAIL NOTIFICATIONS
// ============================================

/**
 * Send email notification via Supabase
 */
export async function sendEmailNotification(
  email: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...payload }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send email notification:', error)
    return false
  }
}

/**
 * Get email template for booking confirmation
 */
export function getBookingConfirmationEmail(booking: BookingWithDetails): {
  subject: string
  html: string
} {
  const { facility, time_slot, booking_date } = booking

  return {
    subject: `Konfirmasi Pesanan ${facility.name} - Teduh`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Konfirmasi Pesanan</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #E65100; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Teduh</h1>
          </div>
          <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #E65100; margin-top: 0;">Pesanan Anda Telah Dikonfirmasi!</h2>
            <p>Halo ${booking.user.full_name},</p>
            <p>Pesanan Anda untuk <strong>${facility.name}</strong> telah dikonfirmasi.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Detail Pesanan:</h3>
              <p><strong>ID:</strong> #${booking.id}</p>
              <p><strong>Fasilitas:</strong> ${facility.name}</p>
              <p><strong>Tanggal:</strong> ${new Date(booking_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Jam:</strong> ${time_slot.start_time} - ${time_slot.end_time}</p>
            </div>

            <p>Silakan tunjukkan QR code ini kepada petugas saat check-in.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}" style="background: #E65100; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px;">Lihat Tiket QR</a>
            </div>

            <p style="font-size: 14px; color: #666;">Terima kasih telah menggunakan Teduh!</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

/**
 * Get email template for booking reminder
 */
export function getBookingReminderEmail(booking: BookingWithDetails): {
  subject: string
  html: string
} {
  const { facility, time_slot, booking_date } = booking

  return {
    subject: `Pengingat Pesanan ${facility.name} - Teduh`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pengingat Pesanan</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #E65100; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Teduh</h1>
          </div>
          <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #E65100; margin-top: 0;">Pengingat Pesanan Anda</h2>
            <p>Halo ${booking.user.full_name},</p>
            <p>Ini adalah pengingat untuk pesanan Anda yang akan datang.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Detail Pesanan:</h3>
              <p><strong>Fasilitas:</strong> ${facility.name}</p>
              <p><strong>Tanggal:</strong> ${new Date(booking_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Jam:</strong> ${time_slot.start_time} - ${time_slot.end_time}</p>
            </div>

            <p>Jangan lupa untuk membawa QR code tiket Anda!</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}" style="background: #E65100; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px;">Lihat Tiket QR</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

// ============================================
// WHATSAPP NOTIFICATIONS (via Twilio)
// ============================================

const WHATSAPP_API_URL = 'https://api.twilio.com/2010-04-01/Accounts'

/**
 * Send WhatsApp notification via Twilio
 */
export async function sendWhatsAppNotification(
  phoneNumber: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, ...payload }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error)
    return false
  }
}

/**
 * Format phone number for WhatsApp (Indonesia)
 */
export function formatWhatsAppNumber(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '')

  // Add country code if not present
  if (!cleaned.startsWith('62')) {
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1)
    } else {
      cleaned = '62' + cleaned
    }
  }

  return cleaned
}

/**
 * Get WhatsApp message template
 */
export function getWhatsAppMessage(payload: NotificationPayload): string {
  const { type, booking } = payload

  if (type === 'booking_confirmed' && booking) {
    return `
*Teduh - Pesanan Dikonfirmasi* 🎉

Halo ${booking.user.full_name}!

Pesanan Anda telah dikonfirmasi:
📍 Fasilitas: ${booking.facility.name}
📅 Tanggal: ${new Date(booking.booking_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
⏰ Jam: ${booking.time_slot.start_time} - ${booking.time_slot.end_time}
🎫 ID: #${booking.id}

Silakan tunjukkan QR code Anda saat check-in.

Terima kasih telah menggunakan Teduh!
    `.trim()
  }

  if (type === 'booking_reminder' && booking) {
    return `
*Teduh - Pengingat Pesanan* ⏰

Halo ${booking.user.full_name}!

Jangan lupa, Anda memiliki pesanan yang akan datang:
📍 Fasilitas: ${booking.facility.name}
📅 Tanggal: ${new Date(booking.booking_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
⏰ Jam: ${booking.time_slot.start_time} - ${booking.time_slot.end_time}

Sampai jumpa!
    `.trim()
  }

  return payload.body
}

// ============================================
// COMBINED NOTIFICATION FUNCTIONS
// ============================================

/**
 * Send notification through all available channels
 */
export async function sendNotification(
  userId: string,
  email: string | null,
  phone: string | null,
  payload: NotificationPayload,
  channels: { push?: boolean; email?: boolean; whatsapp?: boolean } = {
    push: true,
    email: true,
    whatsapp: false,
  }
): Promise<void> {
  const results = {
    push: false,
    email: false,
    whatsapp: false,
  }

  if (channels.push) {
    results.push = await sendPushNotification(userId, payload)
    // Also show local notification if permission granted
    if (Notification.permission === 'granted') {
      showLocalNotification(payload.title, payload.body, payload.data)
    }
  }

  if (channels.email && email) {
    results.email = await sendEmailNotification(email, payload)
  }

  if (channels.whatsapp && phone) {
    results.whatsapp = await sendWhatsAppNotification(phone, payload)
  }

  console.log('Notification results:', results)
}

/**
 * Send booking confirmation notification
 */
export async function sendBookingConfirmation(booking: BookingWithDetails): Promise<void> {
  const payload: NotificationPayload = {
    type: 'booking_confirmed',
    booking,
    userId: booking.user_id,
    title: 'Pesanan Dikonfirmasi',
    body: `Pesanan ${booking.facility.name} Anda telah dikonfirmasi.`,
    data: { bookingId: booking.id },
  }

  await sendNotification(
    booking.user_id,
    null, // Email not available in Profile type, would need to fetch from Auth
    booking.user.phone,
    payload,
    { push: true, email: true, whatsapp: true }
  )
}

/**
 * Send booking reminder notification
 */
export async function sendBookingReminder(booking: BookingWithDetails): Promise<void> {
  const payload: NotificationPayload = {
    type: 'booking_reminder',
    booking,
    userId: booking.user_id,
    title: 'Pengingat Pesanan',
    body: `Anda memiliki pesanan untuk ${booking.facility.name} besok.`,
    data: { bookingId: booking.id },
  }

  await sendNotification(
    booking.user_id,
    null, // Email not available in Profile type
    booking.user.phone,
    payload,
    { push: true, email: true, whatsapp: true }
  )
}

/**
 * Send booking cancellation notification
 */
export async function sendBookingCancellation(booking: BookingWithDetails): Promise<void> {
  const payload: NotificationPayload = {
    type: 'booking_cancelled',
    booking,
    userId: booking.user_id,
    title: 'Pesanan Dibatalkan',
    body: `Pesanan ${booking.facility.name} Anda telah dibatalkan.`,
    data: { bookingId: booking.id },
  }

  await sendNotification(
    booking.user_id,
    null, // Email not available in Profile type
    booking.user.phone,
    payload,
    { push: true, email: true, whatsapp: true }
  )
}
