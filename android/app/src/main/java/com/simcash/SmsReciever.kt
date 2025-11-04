package com.simcash

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION == intent.action) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            for (sms in messages) {
                val sender = sms.displayOriginatingAddress
                val body = sms.messageBody
                Log.d("SmsReceiver", "📩 From: $sender, Message: $body")

                // Forward SMS data to BackgroundService for processing (works when app not running)
                val serviceIntent = Intent(context, BackgroundService::class.java).apply {
                    putExtra("sender", sender)
                    putExtra("body", body)
                }

                // startForegroundService required on Android O+ when starting service from background
                try {
                    context.startForegroundService(serviceIntent)
                } catch (e: Exception) {
                    // fallback
                    context.startService(serviceIntent)
                }
            }
        }
    }
}
